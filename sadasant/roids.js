/* roids.js
 * By Daniel R. (sadasant.com)
 * for #jsve (groups.google.com/group/jsv)
 *
 * Here will be all the math stuff and objects for asteroidsjs
 *
 */

/* Anonymous functions also hacked paypal.
 * No, but they can return stuff that can handle runtime variables.
 * Which are unreachable for the user (private variables!).
 * They're also called lambdas.
 */
var roids = (function(){ //
  // All this codes are just for pre-defining the object
  // so here be hidden vars and methods
  var started = "You've started roids.js";
  
  function fork(from,to){
    for (var i in from){
      if (from.hasOwnProperty(i)) {
        to[i] = from[i];
      }
    }
  }
  /* MOTHER */
  var Obj = function(){
    
  };
  Obj.prototype = {
    turn: function(to){
      var rad = (typeof(to) == "number") ? to*(Math.PI/180) : Math.PI/30 * ((to === "left")? -1 : 1);
      this.obj.rotation+=rad;
    },
    accelerator: function(much){
      much = much || 0.2;
      this.obj.run(much);
    },
    brake: function(much){
      much = much || 0.2;
      this.obj.run(-much);
    }
  };
  /* The Ship class. */
  function Ship(R){
    if (!R) return;
    fork(Obj.prototype,this); // FORKING
    var fill = "rgba(150, 255, 0, 0.3)",
      stroke = "rgba(150, 255, 0, 1  )";
    this.obj = new R.Triangle(R.center.x,R.center.y,null,fill,stroke);
    this.obj.infiniteScope = true;
    R.draw(this.obj);
  }
  /* The Rock class */
  function Rock(R,random){
    if (!R) return;
    fork(Obj.prototype,this); // FORKING
    var path = [[0,-20],[-20,0],[-10,20],[20,0]];
    var fill = "rgba(150, 255, 0, 0.3)",
      stroke = "rgba(150, 255, 0, 1  )",
        posx = random ? Math.floor(R.can.width*Math.random()) : R.center.x ,
        posy = random ? Math.floor(R.can.height*Math.random()) : R.center.y ;
    this.obj = new R.Path(posx,posy,path,fill,stroke);
    this.obj.infiniteScope = true;
    R.draw(this.obj);
    this.intervals = [];
    this.randomize = function(){
      this.intervals.push(setInterval((function(obj){
        console.debug('lol');
        var init = 180*Math.random(),
            rotate = 1 + 5*Math.random() * ((Math.floor(2*Math.random()))? -1 : 1),
            accel = Math.ceil(180*Math.random())/100;
        obj.turn(init);
        obj.accelerator(accel);
        return function(){
          obj.turn(rotate);
          obj.accelerator(accel/100);
        };
     })(this),35));
    };
  }
  
  /* The start function
   * "Where everything begins"
   * The R argument will decide if we'll work with canvas or css
   * for that, we must put the same functions and variables in both methods
   */
  function start(R){
    this.R = R; // this should do the reference to the render class
    this.R.start(); // setting the renderer
    this.hero = new Ship(R); // or this.Ship
    for (var i = 0; i < 11; i++){
      this.rocks.push(new Rock(R,true));
      this.rocks[i].randomize();
    }
    // keyboarding!!!
    var lastKey = null;
    document.addEventListener("keydown",function (e) {
      var i = 0, key = e.charCode || e.keyCode;
      if (key == 37 || lastKey == 37) {
        roids.hero.turn("left"); i++;
      }
      if (key == 39 || lastKey == 39) {
        roids.hero.turn("right"); i++;
      }
      if (key == 38 || lastKey == 38) {
        roids.hero.accelerator(); i++;
      }
      if (key == 40 || lastKey == 40) {
        roids.hero.brake(); i++;
      }
      if (lastKey === null) lastKey = key;
      if (i) return e.preventDefault();
    },true);
    document.addEventListener("keyup",function (e) {
      var key = e.charCode || e.keyCode;
      if (key == lastKey) lastKey = null;
    },true);
    if (console && console.debug) console.debug(started);
    return started;
  }

  // This is the real object
  return {
    R: null, // here will be stored the rendering method
    hero: null, // our hero (Ship object)
    rocks: [], // the asteroids
    start: start // Go go go!
  };
}());