/* roids.js
 * By Daniel R. (sadasant.com)
 * License: http://opensource.org/licenses/mit-license.php
 */

/* Anonymous functions also hacked paypal.
 * No, but they can return stuff that can handle runtime variables.
 * Which are unreachable for the user (private variables!).
 * They're also called lambdas.
 */
var asteroids = (function newRoids(){ //
  // All this codes are just for pre-defining the object
  // so here be hidden vars and methods

  var started = "You've started asteroids.js"
    , ids = 0
    , pi_180 = Math.PI/180

  /* Sort-of-inheritance */
  function fork(from,to){
    for (var k in from) {
      if (from.hasOwnProperty(k)) {
        to[k] = from[k]
      }
    }
  }

  /* MOTHER */
  var Obj = function(){}
  Obj.prototype = {
      intervals: {
        rotate : null
      , run    : null
      }
    , clearIntervals: function(){
        for (var i = 0; i < this.intervals.length; i++) {
          clearInterval(this.intervals[i])
        }
      }
    , rotate: function(to,hold){
        var rad = to*pi_180
        if (hold) {
          clearInterval(this.intervals.rotate)
          var interval = function (){
            this.obj.rotation+=rad
          }.bind(this)
          this.intervals.rotate = setInterval(interval,asteroids.R.frame)
        } else {
          this.obj.rotation+=rad
        }
      }
    , run: function(much,hold){
        much = much
        if (hold) {
          clearInterval(this.intervals.run)
          var interval = function (){
            this.obj.run(much)
          }.bind(this)
          this.intervals.run = setInterval(interval,asteroids.R.frame)
        } else {
          this.obj.run(much)
        }
      }
    , inEdge: function(){
        this.obj.rotateInEdge = true
      }
  }

  /* SONS */

  /* The Ship class. */
  function Ship(R){
    if (!R) return
    this.id    = (ids++).toString()
    this.alive = true
    this.busy  = false
    fork(Obj.prototype,this) // FORKING
    this.fill   = "rgba(150, 255, 0, 0.3)"
    this.stroke = "rgba(150, 255, 0, 1  )"
    this.obj = new R.Triangle(R.center.x,R.center.y,null,this.fill,this.stroke)
    this.obj.maxSpeed = {x:2,y:2}
    this.obj.infiniteScope = true
    //this.inEdge()
    R.draw(this.obj)
    this.obj.onCollide = (function(){
      asteroids.R.remove(this.obj)
      asteroids.hero.alive = false
      setTimeout(function(){
        asteroids.start(asteroids.R)
      },1000)
    }).bind(this)
    this.shots = []
    this.shoot = function(){
      if (!this.alive || this.busy) return
      var x = this.obj.x
        , y = this.obj.y
        , len = this.shots.length
        , shot = new asteroids.R.Circle(x,y,1,this.fill,this.stroke)
      shot.onCollide = function(obj){
        if (obj !== undefined && typeof obj.onCollide == 'function') obj.onCollide()
        asteroids.R.remove(asteroids.hero.shots[len])
        asteroids.hero.shots[len] = null
      }
      setTimeout(shot.onCollide,asteroids.level*1000)
      shot.infiniteScope = true
      shot.rotation = this.obj.rotation
      shot.run(13, 13)
      asteroids.R.draw(shot)
      this.shots.push(shot)
      this.busy = true
      setTimeout(function(){
        asteroids.hero.busy = false
      },500-asteroids.level*50)
      setTimeout(function(){
        if (asteroids.hero.shots[len]) {
          if (asteroids.hero.shots[len]) {
            asteroids.hero.shots[len].addCollider(asteroids.hero.obj)
          }
        }
      },500)
      for (var i = 0; i < asteroids.rocks.length; i++) {
        asteroids.hero.shots[len].addCollider(asteroids.rocks[i].obj)
      }
    }
  }

  /* The Rock class */
  function Rock(R,size,random,x,y){
    if (!R) return
    this.id = (ids++).toString()
    this.colliders = []
    fork(Obj.prototype,this) // FORKING
    this.level = size || 2
    var path = [[0,-size*10],[-size*10,0],[-size*10/2,size*10],[size*10,0]]
      , fill = "rgba(82, 163, 0, 0.3)"
      , stroke = "rgba(82, 163, 0, 1  )"
      , posx = x ||(random?Math.floor(R.can.width *Math.random()):R.center.x)
      , posy = y ||(random?Math.floor(R.can.height*Math.random()):R.center.y)
    this.obj = new R.Path(posx,posy,path,fill,stroke)
    this.obj.maxSpeed = {x:7, y:7}
    this.obj.infiniteScope = true
    // onCollide
    this.obj.collideArea = size*10 + 10
    this.obj.onCollide = (function(){
      var less = this.level - 1
      if (this.level === 3) { // lame solution
        asteroids.levels[asteroids.level]--
        if (!asteroids.levels[asteroids.level]) asteroids.levelRocks()
      }
      if (this.level && less) {
        var x = this.obj.x
          , y = this.obj.y
          , rock1 = new Rock(R,less,true,x,y)
          , rock2 = new Rock(R,less,true,x,y)
        rock1.inEdge()
        rock1.randomize(asteroids.level/3)
        rock2.inEdge()
        rock2.randomize(asteroids.level/3)
        asteroids.rocks.push(rock1,rock2)
        asteroids.hero.obj.addCollider(rock1.obj)
        asteroids.hero.obj.addCollider(rock2.obj)
        setTimeout(function shotSensitive(rock1,rock2){
          for (var i = 0; i < asteroids.hero.shots.length; i++) {
            if (asteroids.hero.shots[i] !== null) {
              rock1.obj.addCollider(asteroids.hero.shots[i])
              rock2.obj.addCollider(asteroids.hero.shots[i])
              asteroids.hero.shots[i].addCollider(rock1.obj)
              asteroids.hero.shots[i].addCollider(rock2.obj)
            }
          }
        }.bind(null,rock1,rock2),300)
        updateRockColliders(1500)
      }
      asteroids.R.remove(this.obj)
    }).bind(this)
    // draw
    R.draw(this.obj)
    // intervals
    this.intervals = []
    // randomize
    this.randomize = function(acc){
      acc = acc || 0
      this.intervals.push(setInterval((function(obj){
        var init = 179 * Math.random()
          , rotate = 1 + 5*Math.random()*((Math.floor(2*Math.random()))?-1:1)
          , accel = Math.ceil(179*Math.random())/100
        obj.rotate(init)
        obj.run(accel)
        return function(){
          obj.rotate(rotate)
          obj.run(accel/100 + acc/50) // important
        }
     })(this),asteroids.R.frame))
    }
    // updateColliders
    this.updateColliders = function(){
      for (var i = 0; i < asteroids.rocks.length; i++){
        var id = asteroids.rocks[i].id
        if (id !== this.id && this.colliders.indexOf(id) === -1) {
          this.colliders.push(id)
          this.obj.addCollider(asteroids.rocks[i].obj)
        }
      }
    }
  }

  function updateRockColliders(t){
    t = t || 500
    setTimeout(function(){
      for (var i = 0; i < asteroids.rocks.length; i++) {
        asteroids.rocks[i].updateColliders()
      }
    },t)
  }

  var levels = []
    , level = 0
  function levelRocks(){
    this.level++
    var level_speed = this.level/3
    asteroids.hero.obj.maxSpeed.x += level_speed
    asteroids.hero.obj.maxSpeed.y += level_speed
    var level = Math.ceil(this.level/3)
    document.getElementById("level").innerHTML = this.level-1
    this.levels.push(level)
    for (var i = 0; i < level; i++) {
      this.rocks.push(new Rock(this.R,3,true))
      var l = this.rocks.length-1
      this.rocks[l].inEdge()
      this.rocks[l].randomize()
      this.hero.obj.addCollider(this.rocks[l].obj)
      for (var s in asteroids.hero.shots) {
        if (asteroids.hero.shots[s] !== null) {
          this.rocks[l].obj.addCollider(asteroids.hero.shots[s])
          asteroids.hero.shots[s].addCollider(this.rocks[l].obj)
        }
      }
    }
    updateRockColliders()
  }

  /* The start function
   * The R argument will decide if we'll work with canvas or css
   * for that, we must put the same functions and variables in both methods
   */
  var listeners = false
  function start(R){
    this.ids = 0
    this.levels = []
    this.level = 0
    if (this.hero) {
      this.hero.clearIntervals()
    }
    this.hero = null // our hero (Ship object)
    if (this.rocks) {
      for (var i = 0; i < this.rocks.length; i++) {
        this.rocks[i].clearIntervals()
      }
    }
    this.rocks = [] // the asteroids
    this.R = R // this should do the reference to the render class
    this.R.start({ clear : "rgba(0, 0, 0, .2)" }) // setting the renderer
    this.hero = new Ship(R) // or this.Ship
    this.levelRocks()
    // keyboarding!!!
    if (!listeners) {
      var keys = {
        37: null, 65:null
      , 38: null, 87:null
      , 39: null, 68:null
      , 40: null, 83:null
      , 32: null
      }
      document.addEventListener("keydown",function (e){
        var i = 1, key = e.charCode || e.keyCode
        if (keys[key] === null) {
          keys[key] = true
          i = 0
        }
        if (!i) {
          if (keys[37] || keys[65]) { asteroids.hero.rotate(-7,1) ; i++ }
          if (keys[39] || keys[68]) { asteroids.hero.rotate(7,1)  ; i++ }
          if (keys[38] || keys[87]) { asteroids.hero.run(0.3,1)   ; i++ }
          if (keys[40] || keys[83]) { asteroids.hero.run(-0.3,1)  ; i++ }
          if (keys[32]) {
            asteroids.hero.shoot()
            i++
            keys[32] = null
          }
        }
        if (i) return e.preventDefault()
      },true)
      document.addEventListener("keyup",function (e) {
        var key = e.charCode || e.keyCode
        if (key == 37 || key == 39 || key == 65 || key == 68) {
          asteroids.hero.rotate(0,1)
        }
        if (key == 38 || key == 40 || key == 87 || key == 83) {
          asteroids.hero.run(0,1)
        }
        if (keys[key]) {
          keys[key] = null
          return e.preventDefault()
        }
      },true)
      listeners = true
    }
    if (console && console.debug) console.debug(started)
    return started
  }

  // This is the real object
  return {
    R           : null, // here will be stored the rendering method
    hero        : null, // our hero (Ship object)
    rocks       : [], // the asteroids
    start       : start, // Go go go!
    levels      : levels,
    level       : level,
    levelRocks  : levelRocks
  }
}())
