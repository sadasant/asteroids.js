// roids.js
// By Daniel R. (sadasant.com)
// License: http://opensource.org/licenses/mit-license.php

(function() {

  // Enviroment
  var env = this
    , doc = document
    , M   = Math
    , U // undefined

  // Private Variables
  var ids       = 0
    , level     = 0
    , PI2       = M.PI*1.99
    , ship_path = [[0,-10],[-10,0],[10,0]]
    , listeners = false
    , rocks     = []
    , hero      // [Object Ship]

  // Avoid creating new functions every time
  function rotation_interval(rad) { this.obj.rotation += rad }
  function acceleration_interval(much) { this.obj.accel(much) }

  // Object main prototype
  var Obj = function() {}
  Obj.prototype = {
      // Interval's storage
      intervals : {
        rotate  : null
      , accel   : null
      }
      // Clear the intervals
    , clearIntervals : function() {
        for (var i = 0, l = this.intervals.length; i < l; i++) {
          clearInterval(this.intervals[i])
        }
      }
      // Rotate by radians, hold the rotation? (keep-alive?)
    , rotate : function(rad, hold) {
        if (hold) {
          clearInterval(this.intervals.rotate)
          this.intervals.rotate = setInterval(rotation_interval.bind(this, rad), Ink.frame)
        } else {
          this.obj.rotation += rad
        }
      }
      // Accelerate much ammount of pixels
    , accel : function(much, hold) {
        if (hold) {
          clearInterval(this.intervals.accel)
          this.intervals.accel = setInterval(acceleration_interval.bind(this, much), Ink.frame)
        } else {
          this.obj.accel(much)
        }
      }
      // Rotate in the same position
      // the ship in the traditional asteroids behaves this way
      // here, the ship behaves differently, but rocks still
      // behave this way.
    , inEdge : function() {
        this.obj.rotateInEdge = true
      }
  }

  // Pre-defining ship functions
  // in order to avoid them to be created every time
  function Ship_onCollide() {
    Ink.remove(this.obj)
    hero.alive = false
    setTimeout(asteroids, 1000)
  }

  // The Ship class
  function Ship() {
    Ink.fork(Obj.prototype, this) // FORKING
    var s               = this
    s.id                = (ids++).toString()
    s.alive             = true
    s.busy              = false
    s.fill              = "rgba(150, 255, 0, 0.3)"
    s.stroke            = "rgba(150, 255, 0, 1  )"
    s.obj               = new Ink.Path(Ink.center.x, Ink.center.y, ship_path, this.fill, this.stroke)
    s.obj.maxSpeed      = { x: 2, y: 2}
    s.obj.infiniteScope = true
    s.obj.onCollide     = Ship_onCollide.bind(this)
    s.shots             = []

    Ink.draw(s.obj)

    // Shoot method
    this.shoot = function() {
      // Not alive? Busy? Don't shoot.
      if (!s.alive || s.busy) return

      var len  = s.shots.length
        , shot = new Ink.Circ(s.obj.x, s.obj.y, 1, s.fill, s.stroke)

      // On collide, remove the shot and trigger
      // the encountered's collision
      shot.onCollide = function(obj) {
        if (obj !== U && typeof obj.onCollide == 'function') {
          obj.onCollide()
        }
        Ink.remove(s.shots[len])
        s.shots[len] = null
      }

      // The shoots will last according to the level
      setTimeout(shot.onCollide, 250 << level)

      shot.infiniteScope = true
      shot.rotation      = this.obj.rotation
      shot.accel(7, 7)

      Ink.draw(shot)

      s.shots.push(shot)
      s.busy = true

      // Limit shoot frecuency
      // according to the ship's level
      setTimeout(function() {
        s.busy = false
      }, 500 - level * 50)

      // The shoot will collide with it's shooter
      setTimeout(function() {
        var shot = s.shots[len]
        if (shot) shot.addCollider(hero.obj)
      }, 500)

      // The shoot will collide with rocks
      for (var i = 0, l = rocks.length; i < l; i++) {
        s.shots[len].addCollider(rocks[i].obj)
      }
    }
  }

  // To avoid initializing this function each time a rock is made
  function Rock_onCollide() {
    var less = this.level - 1
    if (this.level === 3) { // lame solution
      if (!--levels[level]) levelRocks()
    }
    if (this.level && less) {
      var rock1 = new Rock(less, true, this.obj.x, this.obj.y)
        , rock2 = new Rock(less, true, this.obj.x, this.obj.y)
      rock1.inEdge()
      rock2.inEdge()
      rock1.randomize(level/3)
      rock2.randomize(level/3)
      rocks.push(rock1, rock2)
      hero.obj.addCollider(rock1.obj)
      hero.obj.addCollider(rock2.obj)
      setTimeout(function shotSensitive(rock1, rock2) {
        for (var i = 0, l = hero.shots.length; i < l; i++) {
          var shot = hero.shots[i]
          if (shot) {
            rock1.obj.addCollider(shot)
            rock2.obj.addCollider(shot)
            shot.addCollider(rock1.obj)
            shot.addCollider(rock2.obj)
          }
        }
      }.bind(null,rock1, rock2), Ink.frame * 10)
      updateRockColliders(1500)
    }
    Ink.remove(this.obj)
  }

  // The Rock class
  function Rock(size, random, x, y){
    Ink.fork(Obj.prototype, this) // FORKING
    var s               = this
    s.id                = (ids++).toString()
    s.colliders         = []
    s.level             = size || 2
    var path            = [[0,-size*10],[-size*10,0],[-size*10/2,size*10],[size*10,0]]
      , fill            = "rgba(82, 163, 0, 0.3)"
      , stroke          = "rgba(82, 163, 0, 1  )"
      , posx            = x || (random ? M.floor(Ink.can.width  * M.random()) : Ink.center.x)
      , posy            = y || (random ? M.floor(Ink.can.height * M.random()) : Ink.center.y)
    s.obj               = new Ink.Path(posx, posy, path, fill, stroke)
    s.obj.maxSpeed      = { x: 7, y: 7 }
    s.obj.infiniteScope = true
    s.intervals         = []

    // onCollide
    s.obj.collideArea = size * 10 + 10
    s.obj.onCollide = Rock_onCollide.bind(this)

    Ink.draw(s.obj)

    // Randomize it's behavior
    s.randomize = function(acc) {
      acc = acc || 0
      s.intervals.push(setInterval((function(obj) {
        var rand       = M.random()
          , init       = rand * PI2
          , rotate     = .01 + .0872 * rand * (M.random() < .5 ? -1 : 1)
          , init_accel = (179 * rand)/100
          , accel      = init_accel/100 + acc/50
        obj.rotate(init)
        obj.accel(init_accel)
        return function() {
          obj.rotate(rotate)
          obj.accel(accel)
        }
     })(s), Ink.frame))
    }

    // updateColliders
    s.updateColliders = function() {
      for (var i = 0, l = rocks.length; i < l; i++){
        var id = rocks[i].id
        if (id !== s.id && !~s.colliders.indexOf(id)) {
          s.colliders.push(id)
          s.obj.addCollider(rocks[i].obj)
        }
      }
    }
  }

  function updateRockColliders(t) {
    t = t || 500
    setTimeout(function() {
      for (var i = 0, l = rocks.length; i < l; i++) {
        rocks[i].updateColliders()
      }
    }, t)
  }

  function levelRocks(){
    level++
    var level_speed                       = level/3
    hero.obj.maxSpeed.x                  += level_speed
    hero.obj.maxSpeed.y                  += level_speed
    doc.getElementById("level").innerHTML = level - 1
    var lev                               = M.ceil(level/3)
    levels.push(lev)
    for (var i = 0; i < lev; i++) {
      rocks.push(new Rock(3, true))
      var rock = rocks[rocks.length - 1]
      rock.inEdge()
      rock.randomize()
      hero.obj.addCollider(rock.obj)
      for (var s in hero.shots) {
        if (hero.shots[s] !== null) {
          rock.obj.addCollider(hero.shots[s])
          hero.shots[s].addCollider(rock.obj)
        }
      }
    }
    updateRockColliders()
  }

  function startEventListeners() {
    var keys = {
      37 : false, 65 : false
    , 38 : false, 87 : false
    , 39 : false, 68 : false
    , 40 : false, 83 : false
    , 32 : false
    }
    doc.addEventListener("keydown", function (e) {
      e.preventDefault()
      var key = e.charCode || e.keyCode
      if (keys[key]) return
      keys[key] = true
      if (key == 37) hero.rotate(-.1221,1)
      if (key == 39) hero.rotate( .1221,1)
      if (key == 38) hero.accel( .2, 1)
      if (key == 40) hero.accel(-.2, 1)
      if (key == 32) {
        hero.shoot()
        keys[32] = false
      }
    }, true)
    doc.addEventListener("keyup", function (e) {
      e.preventDefault()
      var key = e.charCode || e.keyCode
      if (key == 37) hero.rotate(keys[39] ?  .1221 : 0, 1) ; else
      if (key == 39) hero.rotate(keys[37] ? -.1221 : 0, 1) ; else
      if (key == 38) hero.accel (keys[40] ? -.2 : 0, 1) ; else
      if (key == 40) hero.accel (keys[38] ? -.2 : 0, 1)
      if (keys[key]) {
        keys[key] = false
      }
    }, true)
    listeners = true
  }

  var started = 0
  // The start function
  function start() {
    ids    = 0
    levels = []
    level  = 0
    // Restart
    if (hero) hero.clearIntervals()
    rocks.map(function(r) { r.clearIntervals() })
    hero  = null
    rocks = []
    Ink.init(U, U, U, "rgba(0, 0, 0, .2)") // Starting Ink.js
    hero = new Ship()
    /**/
    // Uncomment the 3 lines below and comment the 2 lines above
    // to test a more traditional asteroids game
    /*
    Ink.init(U, U, U, "rgba(0, 0, 0, 1)") // Starting Ink.js
    hero = new Ship()
    hero.obj.rotateInEdge  = true
    */
    levelRocks()
    if (!listeners) startEventListeners() // Event Listeners

  }

  // API
  env.asteroids = start

})()
