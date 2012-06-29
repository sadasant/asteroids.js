// roids.js
// By Daniel R. (sadasant.com)
// License: http://opensource.org/licenses/mit-license.php

(function() {

  // Enviroment
  var env = this
    , doc = document
    , M   = Math
    , U   // undefined

  // Private Variables
  var ids         = 0
    , level       = 0
    , PI2         = M.PI*1.99
    , ship_path   = [[0,-10],[-10,0],[10,0]]
    , listeners   = false
    , rocks       = []
    , hero        // [Object Ship]
    , started     = 0
    , level_factor = 3

  // Avoid creating new functions every time

  function rotation_interval(rad) {
    this.obj.rotation += rad
  }

  function acceleration_interval(much) {
    this.obj.accel(much)
  }

  // Object main prototype

  Main = {
    // Interval's storage
    intervals : {
      rotate  : null
    , accel   : null
    }
    // Clear the intervals
  , clearIntervals : function() {
      var i = 0
        , l = this.intervals.length
      for (; i < l; i++) {
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
    var s = Object.create(Main)
    s.id                = (ids++).toString()
    s.alive             = true
    s.busy              = false
    s.fill              = "rgba(150, 255, 0, 0.3)"
    s.stroke            = "rgba(150, 255, 0, 1  )"
    s.obj               = new Ink.Path(Ink.center.x, Ink.center.y, ship_path, s.fill, s.stroke)
    s.obj.maxSpeed      = { x: 2, y: 2}
    s.obj.infiniteScope = true
    s.obj.onCollide     = Ship_onCollide.bind(s)
    s.shots             = []

    Ink.draw(s.obj)

    // Shoot method
    s.shoot = function() {
      // Not alive? Busy? Don't shoot.
      if (!s.alive || s.busy) return

      var len  = s.shots.length
        , shot = new Ink.Circ(s.obj.x, s.obj.y, 1, s.fill, s.stroke)
        , i, l

      // On collide, remove the shot and trigger
      // the encountered's collision
      shot.onCollide = function(obj) {
        if (obj !== U && typeof obj.onCollide === 'function') {
          obj.onCollide()
        }
        Ink.remove(s.shots[len])
        s.shots[len] = null
      }

      // The shoots will last according to the level
      setTimeout(shot.onCollide, 500 * level)

      shot.infiniteScope = true
      shot.rotation      = this.obj.rotation
      var shot_acc = 2 + s.obj.maxSpeed.x
      shot.accel(shot_acc, shot_acc)

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
      i = 0
      l = rocks.length
      for (; i < l; i++) {
        s.shots[len].addCollider(rocks[i].obj)
      }
    }

    return s // this
  }

  // To avoid initializing this function each time a rock is made
  function Rock_onCollide() {
    var less = this.level - 1
    if (this.level === level_factor) { // lame solution
      if (!--levels[level]) levelRocks()
    }
    if (this.level && less) {
      var rock1 = new Rock(less, true, this.obj.x, this.obj.y)
        , rock2 = new Rock(less, true, this.obj.x, this.obj.y)
        , i, l
        , shot
      rock1.inEdge()
      rock2.inEdge()
      rock1.randomize(level/level_factor)
      rock2.randomize(level/level_factor)
      rocks.push(rock1, rock2)
      hero.obj.addCollider(rock1.obj)
      hero.obj.addCollider(rock2.obj)
      i = 0
      l = hero.shots.length
      setTimeout(function shotSensitive(rock1, rock2) {
        for (; i < l; i++) {
          shot = hero.shots[i]
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
    var s = Object.create(Main)
      , path            = [[0,-size*10],[-size*10,0],[-size*10/2,size*10],[size*10,0]]
      , fill            = "rgba(82, 163, 0, 0.3)"
      , stroke          = "rgba(82, 163, 0, 1  )"
      , posx            = x || (random ? Ink.can.width  * M.random() << 0 : Ink.center.x)
      , posy            = y || (random ? Ink.can.height * M.random() << 0 : Ink.center.y)
    s.id                = (ids++).toString()
    s.colliders         = []
    s.level             = size || 2
    s.obj               = new Ink.Path(posx, posy, path, fill, stroke)
    s.obj.maxSpeed      = { x: 7, y: 7 }
    s.obj.infiniteScope = true
    s.intervals         = []

    // onCollide
    s.obj.collideArea = size * 10 + 10
    s.obj.onCollide = Rock_onCollide.bind(s)

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
      var i = 0
        , l = rocks.length
      for (; i < l; i++){
        var id = rocks[i].id
        if (id !== s.id && !~s.colliders.indexOf(id)) {
          s.colliders.push(id)
          s.obj.addCollider(rocks[i].obj)
        }
      }
    }

    return s // this
  }

  function updateRockColliders(t) {
    t = t || 500
    var i = 0
      , l = rocks.length
    setTimeout(function() {
      for (; i < l; i++) {
        rocks[i] && rocks[i].updateColliders()
      }
    }, t)
  }

  function levelRocks(){
    level++
    var level_speed = level/level_factor
      , lev         = M.ceil(level/level_factor)
      , i = 0
      , rock
      , s
    hero.obj.maxSpeed.x += level_speed
    hero.obj.maxSpeed.y += level_speed
    doc.getElementById("level").innerHTML = level - 1
    levels.push(lev)
    for (; i < lev; i++) {
      rocks.push(new Rock(level_factor, true))
      rock = rocks[rocks.length - 1]
      rock.inEdge()
      rock.randomize()
      hero.obj.addCollider(rock.obj)
      for (s in hero.shots) {
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
      var key  = e.charCode || e.keyCode
        , _key = keys[key]
      if (_key === U) return
      e.preventDefault()
      if (_key) return
      keys[key] = true
      if (key === 37) hero.rotate(-.1221,1)
      if (key === 39) hero.rotate( .1221,1)
      if (key === 38) hero.accel( .2, 1)
      if (key === 40) hero.accel(-.2, 1)
      if (key === 32) {
        hero.shoot()
        keys[32] = false
      }
    }, true)
    doc.addEventListener("keyup", function (e) {
      e.preventDefault()
      var key = e.charCode || e.keyCode
      if (key === 37) hero.rotate(keys[39] ?  .1221 : 0, 1) ; else
      if (key === 39) hero.rotate(keys[37] ? -.1221 : 0, 1) ; else
      if (key === 38) hero.accel (keys[40] ? -.2    : 0, 1) ; else
      if (key === 40) hero.accel (keys[38] ? -.2    : 0, 1)
      if (keys[key]) {
        keys[key] = false
      }
    }, true)
    listeners = true
  }

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
