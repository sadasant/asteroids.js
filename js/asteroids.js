/* roids.js
 * By Daniel R. (sadasant.com)
 * License: http://opensource.org/licenses/mit-license.php
 */

(function() {

  // Enviroment
  var env = this
    , doc = document
    , M   = Math

  // Private Variables
  //·-----------------

  var ids       = 0
    , PI180     = M.PI/180
    , listeners = false
    , rocks = []
    , levels = []
    , level = 0
    , hero
    , ids
    , level
    , levels


  // Object main prototype
  var Obj = function() {}
  Obj.prototype = {
      intervals : {
        rotate : null
      , run    : null
      }
    , clearIntervals: function() {
        for (var i = 0; i < this.intervals.length; i++) {
          clearInterval(this.intervals[i])
        }
      }
    , rotate: function(to, hold) {
        var rad = to*PI180
        if (hold) {
          clearInterval(this.intervals.rotate)
          var interval = function() { this.obj.rotation += rad }.bind(this)
          this.intervals.rotate = setInterval(interval, Ink.frame)
        } else {
          this.obj.rotation += rad
        }
      }
    , run: function(much, hold) {
        if (hold) {
          clearInterval(this.intervals.run)
          var interval = function() { this.obj.run(much) }.bind(this)
          this.intervals.run = setInterval(interval, Ink.frame)
        } else {
          this.obj.run(much)
        }
      }
    , inEdge: function() {
        this.obj.rotateInEdge = true
      }
  }

  // The Ship class
  function Ship() {
    this.id    = (ids++).toString()
    this.alive = true
    this.busy  = false
    Ink.fork(Obj.prototype,this) // FORKING
    this.fill   = "rgba(150, 255, 0, 0.3)"
    this.stroke = "rgba(150, 255, 0, 1  )"
    this.obj = new Ink.Triangle( Ink.center.x, Ink.center.y, null, this.fill, this.stroke)
    this.obj.maxSpeed = {x:2,y:2}
    this.obj.infiniteScope = true
    Ink.draw(this.obj)
    this.obj.onCollide = (function() {
      Ink.remove(this.obj)
      hero.alive = false
      setTimeout(function() { asteroids() }, 1000)
    }).bind(this)
    this.shots = []
    this.shoot = function() {
      if (!this.alive || this.busy) return
      var len = this.shots.length
        , shot = new Ink.Circle(this.obj.x, this.obj.y, 1, this.fill, this.stroke)
      shot.onCollide = function(obj) {
        if (obj !== undefined && typeof obj.onCollide == 'function') obj.onCollide()
        Ink.remove(hero.shots[len])
        hero.shots[len] = null
      }
      setTimeout(shot.onCollide, level * 1000)
      shot.infiniteScope = true
      shot.rotation = this.obj.rotation
      shot.run(13, 13)
      Ink.draw(shot)
      this.shots.push(shot)
      this.busy = true
      setTimeout(function() {
        hero.busy = false
      }, 500 - level * 50)
      setTimeout(function() {
        if (hero.shots[len]) {
          if (hero.shots[len]) {
            hero.shots[len].addCollider(hero.obj)
          }
        }
      }, 500)
      for (var i = 0; i < rocks.length; i++) {
        hero.shots[len].addCollider(rocks[i].obj)
      }
    }
  }

  // The Rock class
  function Rock(size, random, x, y){
    this.id = (ids++).toString()
    this.colliders = []
    Ink.fork(Obj.prototype, this) // FORKING
    this.level = size || 2
    var path = [[0,-size*10],[-size*10,0],[-size*10/2,size*10],[size*10,0]]
      , fill   = "rgba(82, 163, 0, 0.3)"
      , stroke = "rgba(82, 163, 0, 1  )"
      , posx = x || (random ? M.floor(Ink.can.width  * M.random()) : Ink.center.x)
      , posy = y || (random ? M.floor(Ink.can.height * M.random()) : Ink.center.y)
    this.obj = new Ink.Path(posx, posy, path, fill, stroke)
    this.obj.maxSpeed = { x: 7, y: 7 }
    this.obj.infiniteScope = true
    // onCollide
    this.obj.collideArea = size * 10 + 10
    this.obj.onCollide = (function() {
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
          for (var i = 0; i < hero.shots.length; i++) {
            try {
              rock1.obj.addCollider(hero.shots[i])
              rock2.obj.addCollider(hero.shots[i])
              hero.shots[i].addCollider(rock1.obj)
              hero.shots[i].addCollider(rock2.obj)
            } catch (e) {
            }
          }
        }.bind(null,rock1, rock2), Ink.frame * 10)
        updateRockColliders(1500)
      }
      Ink.remove(this.obj)
    }).bind(this)
    Ink.draw(this.obj)
    this.intervals = []
    this.randomize = function(acc) {
      acc = acc || 0
      this.intervals.push(setInterval((function(obj) {
        var rand = M.random()
          , init = 179 * rand
          , rotate = 1 + 5 * rand * (M.random() < .5 ? -1 : 1)
          , accel = M.ceil(179 * rand)/100
        obj.rotate(init)
        obj.run(accel)
        return function() {
          obj.rotate(rotate)
          obj.run(accel/100 + acc/50) // important
        }
     })(this), Ink.frame))
    }
    // updateColliders
    this.updateColliders = function() {
      for (var i = 0; i < rocks.length; i++){
        var id = rocks[i].id
        if (id !== this.id && !~this.colliders.indexOf(id)) {
          this.colliders.push(id)
          this.obj.addCollider(rocks[i].obj)
        }
      }
    }
  }

  function updateRockColliders(t) {
    t = t || 500
    setTimeout(function() {
      for (var i = 0; i < rocks.length; i++) {
        rocks[i].updateColliders()
      }
    }, t)
  }

  function levelRocks(){
    level++
    var level_speed = level/3
    hero.obj.maxSpeed.x += level_speed
    hero.obj.maxSpeed.y += level_speed
    doc.getElementById("level").innerHTML = level - 1
    var lev = M.ceil(level/3)
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
      37: null, 65:null
    , 38: null, 87:null
    , 39: null, 68:null
    , 40: null, 83:null
    , 32: null
    }
    doc.addEventListener("keydown", function (e) {
      var i = 1, key = e.charCode || e.keyCode
      if (!keys[key]) keys[key] = true, i = 0
      if (!i) {
        if (keys[37] || keys[65]) { hero.rotate(-7,1) ; i++ }
        if (keys[39] || keys[68]) { hero.rotate(7,1)  ; i++ }
        if (keys[38] || keys[87]) { hero.run(0.3,1)   ; i++ }
        if (keys[40] || keys[83]) { hero.run(-0.3,1)  ; i++ }
        if (keys[32]) {
          hero.shoot()
          keys[32] = null
          i++
        }
      }
      if (i) return e.preventDefault()
    }, true)
    doc.addEventListener("keyup", function (e) {
      var key = e.charCode || e.keyCode
      if (key == 37 || key == 39 || key == 65 || key == 68) hero.rotate(0,1)
      if (key == 38 || key == 40 || key == 87 || key == 83) hero.run(0,1)
      if (keys[key]) {
        keys[key] = null
        return e.preventDefault()
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
    Ink.start({ clear : "rgba(0, 0, 0, .2)" }) // Starting Ink.js
    hero = new Ship()
    levelRocks()
    if (!listeners) startEventListeners() // Event Listeners
  }

  // API
  env.asteroids = start

})()
