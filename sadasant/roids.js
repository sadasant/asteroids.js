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
var roids = (function newRoids(){ //
  // All this codes are just for pre-defining the object
  // so here be hidden vars and methods
  var started = "You've started roids.js";
  var ids = 0;
  /* Sort-of-inheritance */
  function fork(from,to){
    for (var i in from) {
      if (from.hasOwnProperty(i)) {
        to[i] = from[i];
      }
    }
  }
  /* MOTHER */
  var Obj = function(){};
  Obj.prototype = {
    intervals: { rotate:null, run:null },
    clearIntervals: function(){
      for (var i in this.intervals) {
        clearInterval(this.intervals[i]);
      }
    },
    rotate: function(to,hold){
      var rad = to*(Math.PI/180);
      if (hold) {
        clearInterval(this.intervals.rotate);
        var interval = function (){
          this.obj.rotation+=rad;
        }.bind(this);
        this.intervals.rotate = setInterval(interval,roids.R.frame);
      } else {
        this.obj.rotation+=rad;
      }
    },
    run: function(much,hold){
      much = much;
      if (hold) {
        clearInterval(this.intervals.run);
        var interval = function (){
          this.obj.run(much);
        }.bind(this);
        this.intervals.run = setInterval(interval,roids.R.frame);
      } else {
        this.obj.run(much);
      }
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
    this.alive = true;
    fork(Obj.prototype,this); // FORKING
    this.fill = "rgba(150, 255, 0, 0.3)";
    this.stroke = "rgba(150, 255, 0, 1  )";
    this.obj = new R.Triangle(R.center.x,R.center.y,null,this.fill,this.stroke);
    this.obj.infiniteScope = true;
    //this.inEdge();
    R.draw(this.obj);
    this.obj.onCollide = (function(){
      roids.R.remove(this.obj);
      roids.hero.alive = false;
      setTimeout(function(){
        roids.start(roids.R);
      },1000);
    }).bind(this);
    this.shots = [];
    this.shoot = function(){
      if (!this.alive) return;
      var x = this.obj.x;
      var y = this.obj.y;
      var len = this.shots.length;
      var shot = new roids.R.Circle(x,y,1,this.fill,this.stroke);
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
        if (roids.hero.shots[len]) {
          if (roids.hero.shots[len]) {
            roids.hero.shots[len].addCollider(roids.hero.obj);
          }
        }
      },500);
      for (var i in roids.rocks) {
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
    var fill = "rgba(82, 163, 0, 0.3)";
    var stroke = "rgba(82, 163, 0, 1  )";
    var posx = x ||(random?Math.floor(R.can.width*Math.random()) :R.center.x);
    var posy = y ||(random?Math.floor(R.can.height*Math.random()):R.center.y);
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
        roids.hero.obj.addCollider(rock1.obj);
        roids.hero.obj.addCollider(rock2.obj);
        setTimeout(function shotSensitive(rock1,rock2){
          for (var i in roids.hero.shots) {
            if (roids.hero.shots[i] !== null) {
              rock1.obj.addCollider(roids.hero.shots[i]);
              rock2.obj.addCollider(roids.hero.shots[i]);
              roids.hero.shots[i].addCollider(rock1.obj);
              roids.hero.shots[i].addCollider(rock2.obj);
            }
          }
        }.bind(null,rock1,rock2),300);
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
        var init = 180 * Math.random();
        var rotate = 1 + 5*Math.random()*((Math.floor(2*Math.random()))?-1:1);
        var accel = Math.ceil(180*Math.random())/100;
        obj.rotate(init);
        obj.run(accel);
        return function(){
          obj.rotate(rotate);
          obj.run(accel/100 + acc/50); // important
        };
     })(this),roids.R.frame));
    };
    // updateColliders
    this.updateColliders = function(){
      for (var i in roids.rocks){
        var id = roids.rocks[i].id;
        if (id !== this.id && this.colliders.indexOf(id) === -1) {
          this.colliders.push(id);
          this.obj.addCollider(roids.rocks[i].obj);
        }
      }
    };
  }
  function updateRockColliders(t){
    t = t || 500;
    setTimeout(function(){
      for (var i in roids.rocks) {
        roids.rocks[i].updateColliders();
      }
    },t);
  }
  var levels = [];
  var level = 0;
  function levelRocks(){
    this.level++;
    var level = Math.ceil(this.level/3);
    document.getElementById("level").innerHTML = this.level-1;
    this.levels.push(level);
    for (var i = 0; i < level; i++) {
      this.rocks.push(new Rock(this.R,3,true));
      var l = this.rocks.length-1;
      this.rocks[l].inEdge();
      this.rocks[l].randomize();
      this.hero.obj.addCollider(this.rocks[l].obj);
      for (var s in roids.hero.shots) {
        if (roids.hero.shots[s] !== null) {
          this.rocks[l].obj.addCollider(roids.hero.shots[s]);
          roids.hero.shots[s].addCollider(this.rocks[l].obj);
        }
      }
    }
    updateRockColliders();
  }
  /* The start function
   * "Where everything begins"
   * The R argument will decide if we'll work with canvas or css
   * for that, we must put the same functions and variables in both methods
   */
  var listeners = false;
  function start(R){
    this.ids = 0;
    this.levels = [];
    this.level = 0;
    if (this.hero) {
      this.hero.clearIntervals();
    }
    this.hero = null; // our hero (Ship object)
    if (this.rocks) {
      for (var i in this.rocks) {
        this.rocks[i].clearIntervals();
      }
    }
    this.rocks = []; // the asteroids
    this.R = R; // this should do the reference to the render class
    this.R.start(); // setting the renderer
    this.hero = new Ship(R); // or this.Ship
    this.levelRocks();
    // keyboarding!!!
    if (!listeners) {
      var keys = {
        37:null, 65:null,
        38:null, 87:null,
        39:null, 68:null,
        40:null, 83:null,
        32:null
      };
      document.addEventListener("keydown",function (e){
        var i = 1, key = e.charCode || e.keyCode;
        if (keys[key] === null) {
          keys[key] = true;
          i = 0;
        }
        if (!i) {
          if (keys[37] || keys[65]) { roids.hero.rotate(-7,1); i++; }
          if (keys[39] || keys[68]) { roids.hero.rotate(7,1); i++; }
          if (keys[38] || keys[87]) { roids.hero.run(0.3,1); i++; }
          if (keys[40] || keys[83]) { roids.hero.run(-0.3,1); i++; }
          if (keys[32]) { roids.hero.shoot(); i++; keys[32] = null; }
        }
        if (i) return e.preventDefault();
      },true);
      document.addEventListener("keyup",function (e) {
        var key = e.charCode || e.keyCode;
        if (key == 37 || key == 39 || key == 65 || key == 68) {
          roids.hero.rotate(0,1);
        }
        if (key == 38 || key == 40 || key == 87 || key == 83) {
          roids.hero.run(0,1);
        }
        if (keys[key]) {
          keys[key] = null;
          return e.preventDefault();
        }
      },true);
      listeners = true;
    }
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