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
  var ids = 0;
  /* Sort-of-inheritance */
  function fork(from,to){
    for (var i in from){
      if (from.hasOwnProperty(i)) {
        to[i] = from[i];
      }
    }
  }
  /* MOTHER */
  var Obj = function(){};
  Obj.prototype = {
    turn: function(to){
      var rad = to*(Math.PI/180);
      this.obj.rotation+=rad;
    },
    accelerator: function(much){
      much = much || 0.5;
      this.obj.run(much);
    },
    brake: function(much){
      much = much || 0.5;
      this.obj.run(-much);
    },
    inEdge: function(){
      this.obj.rotateInEdge = true;
    }
  };
  /* SONS */
  /* The Ship class. */
  function Ship(R){
    if (!R) return;
    this.id = (ids++).toString();
    fork(Obj.prototype,this); // FORKING
    this.fill = "rgba(150, 255, 0, 0.3)";
    this.stroke = "rgba(150, 255, 0, 1  )";
    this.obj = new R.Triangle(R.center.x,R.center.y,null,this.fill,this.stroke);
    this.obj.infiniteScope = true;
    //this.inEdge();
    R.draw(this.obj);
    this.obj.onCollide = (function(){
      roids.R.remove(this.obj);
    }).bind(this);
    this.shots = [];
    this.shoot = function(){
      var x = this.obj.x;
      var y = this.obj.y;
      var len = this.shots.length;
      shot = new roids.R.Circle(x,y,1,this.fill,this.stroke);
      shot.onCollide = function(obj){
        obj.onCollide();
        roids.R.remove(roids.hero.shots[len]);
        roids.hero.shots[len] = null;
      };
      shot.infiniteScope = true;
      shot.rotation = this.obj.rotation;
      shot.run(11);
      roids.R.draw(shot);
      this.shots.push(shot);
      setTimeout(function(){
        roids.hero.shots[len].addCollider(roids.hero.obj);
      },500);
      for (var i in roids.rocks){
        roids.hero.shots[len].addCollider(roids.rocks[i].obj);
      }
    };
  }
  /* The Rock class */
  function Rock(R,size,random,x,y){
    if (!R) return;
    this.id = (ids++).toString();
    this.colliders = [];
    fork(Obj.prototype,this); // FORKING
    this.level = size || 2;
    var path = [[0,-size*10],[-size*10,0],[-size*10/2,size*10],[size*10,0]];
    var fill = "rgba(150, 255, 0, 0.3)",
      stroke = "rgba(150, 255, 0, 1  )",
        posx = x ||(random?Math.floor(R.can.width*Math.random()) :R.center.x),
        posy = y ||(random?Math.floor(R.can.height*Math.random()):R.center.y);
    this.obj = new R.Path(posx,posy,path,fill,stroke);
    this.obj.infiniteScope = true;
    // onCollide
    this.obj.collideArea = size*10 + 5;
    this.obj.onCollide = (function(){
      var less = this.level - 1;
      if (this.level === 3) { // lame solution
        roids.levels[roids.level]--;
        if (!roids.levels[roids.level]) roids.levelRocks();
      }
      if (this.level && less) {
        var x = this.obj.x;
        var y = this.obj.y;
        var rock1 = new Rock(R,less,true,x,y);
        var rock2 = new Rock(R,less,true,x,y);
        rock1.inEdge(); rock1.randomize(roids.level);
        rock2.inEdge(); rock2.randomize(roids.level);
        roids.rocks.push(rock1,rock2);
        roids.hero.obj.addCollider(roids.rocks[roids.rocks.length-1].obj);
        roids.hero.obj.addCollider(roids.rocks[roids.rocks.length-2].obj);
        updateRockColliders(1500);
      }
      roids.R.remove(this.obj);
    }).bind(this);
    // draw
    R.draw(this.obj);
    // intervals
    this.intervals = [];
    // randomize
    this.randomize = function(acc){
      acc = acc || 0;
      this.intervals.push(setInterval((function(obj){
        var init = 180 * Math.random(),
          rotate = 1 + 5*Math.random()*((Math.floor(2*Math.random()))?-1:1),
          accel = Math.ceil(180*Math.random())/100;
        obj.turn(init);
        obj.accelerator(accel);
        return function(){
          obj.turn(rotate);
          obj.accelerator(accel/100 + acc/50); // important
        };
     })(this),35));
    };
    // updateColliders
    this.updateColliders = function(){
      for (var i in roids.rocks){
        var id = roids.rocks[i].id;
        if (id !== this.id && this.colliders.indexOf(id) === -1){
          this.colliders.push(id);
          this.obj.addCollider(roids.rocks[i].obj);
        }
      }
    };
  }
  function updateRockColliders(t){
    t = t || 500;
    setTimeout(function(){
      for (var i in roids.rocks){
        roids.rocks[i].updateColliders();
      }
    },t);
  }
  var levels = [];
  var level = -1;
  function levelRocks(){
    this.level++;
    this.levels.push(7);
    for (var i = 0; i < 7; i++){
      this.rocks.push(new Rock(this.R,3,true));
      var l = this.rocks.length-1;
      this.rocks[l].inEdge();
      this.rocks[l].randomize();
      this.hero.obj.addCollider(this.rocks[l].obj);
    }
    updateRockColliders();
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
    this.levelRocks();
    // keyboarding!!!
    var keys = {
      37:null, 65:null,
      38:null, 87:null,
      39:null, 68:null,
      40:null, 83:null,
      32:null
    };
    document.addEventListener("keydown",function (e) {
      var i = 0, key = e.charCode || e.keyCode;
      if (keys[key] === null) keys[key] = true;
      if (keys[37] || keys[65]) { roids.hero.turn(-10); i++; }
      if (keys[39] || keys[68]) { roids.hero.turn(10); i++; }
      if (keys[38] || keys[87]) { roids.hero.accelerator(); i++; }
      if (keys[40] || keys[83]) { roids.hero.brake(); i++; }
      if (keys[32]) { roids.hero.shoot(); i++; keys[32] = null; }
      if (i) return e.preventDefault();
    },true);
    document.addEventListener("keyup",function (e) {
      var key = e.charCode || e.keyCode;
      if (keys[key]) {
        keys[key] = null;
        return e.preventDefault();
      }
    },true);
    if (console && console.debug) console.debug(started);
    return started;
  }

  // This is the real object
  return {
    R: null, // here will be stored the rendering method
    hero: null, // our hero (Ship object)
    rocks: [], // the asteroids
    start: start, // Go go go!
    levels: levels,
    level: level,
    levelRocks: levelRocks
  };
}());