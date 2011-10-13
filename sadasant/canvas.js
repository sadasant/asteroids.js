/* canvas.js
 * By Daniel R. (sadasant.com)
 * for #jsve (groups.google.com/group/jsv)
 *
 * roids.js's objects rendered with canvas
 *
 */
 
var canvas = (function newCanvas(){ //
  /* PRIVATE VARS */
  var started = "You've started canvas.js";
  var _drawStack = {};
  var ids = 0;
  var removed = [];
  var apply_draw = null;
  /* PRIVATE METHODS */
  getWindowSize = function() {
    var winW = 630, winH = 460;
    if (document.body && document.body.offsetWidth) {
     winW = document.body.offsetWidth;
     winH = document.body.offsetHeight;
    }
    if (document.compatMode=='CSS1Compat' &&
        document.documentElement &&
        document.documentElement.offsetWidth ) {
     winW = document.documentElement.offsetWidth;
     winH = document.documentElement.offsetHeight;
    }
    if (window.innerWidth && window.innerHeight) {
     winW = window.innerWidth;
     winH = window.innerHeight;
    }
    return {w:winW,h:winH};
  };
  function drawStack(){
    var can = canvas.can;
    var con = canvas.con;
    if (!can || !con) return;
    if (canvas.clear) {
      canvas.draw(new canvas.Rect(0, 0, can.width, can.height, this.clear),1);
      canvas.clear = null;
    }
    for (var i in _drawStack){
      if (!_drawStack[i]) continue;
      con.save();
      _drawStack[i].draw(can,con);
      con.restore();
    }
  }
  /* PUBLIC METHODS */
  function draw(obj,first){
    _drawStack[obj.id] = obj;
  }
  function remove(obj){
    if (!obj) return;
    removed.push(obj.id);
    _drawStack[obj.id] = null;
  }
  function fork(from,to){
    for (var i in from){
      if (from.hasOwnProperty(i)) {
        to[i] = from[i];
      }
    }
  }
  /* MOTHERS */
  function F() {}
  F.prototype = {
    foreverInScope: function(can,con){
      if (this.x > can.width-10)  this.x -= can.width;
      if (this.x < -10)  this.x += can.width-10;
      if (this.y > can.height) this.y -= can.height;
      if (this.y < -10)  this.y += can.height;
    },
    //rotateInEdge: false,
    maxSpeed: {x:10, y:10},
    run: function(much,maxSpeed){
      if (maxSpeed) {
        this.maxSpeed.x = maxSpeed;
        this.maxSpeed.y = maxSpeed;
      }
      much = much;
      if (this.rotateInEdge) {
        var a = this.rotation;
        var x = (0 * Math.cos(a)) - (much * Math.sin(a));
        var y = (much * Math.cos(a)) + (0 * Math.sin(a));
        this.speed.x += x;
        this.speed.y += y;
      } else {
        this.speed.x += much;
        this.speed.y += much;
      }
      var abs = {x:Math.abs(this.speed.x),y:Math.abs(this.speed.y)};
      if (abs.x > this.maxSpeed.x) {
        this.speed.x = (abs.x/this.speed.x)*this.maxSpeed.x;
      }
      if (abs.y > this.maxSpeed.y) {
        this.speed.y = (abs.y/this.speed.y)*this.maxSpeed.y;
      }
    },
    repos: function(){
      if (this.rotateInEdge) {
        this.x -= this.speed.x;
        this.y -= this.speed.y;
      } else {
        var a = this.rotation;
        this.x -= (0 * Math.cos(a)) - (this.speed.x * Math.sin(a));
        this.y -= (this.speed.y * Math.cos(a)) + (0 * Math.sin(a));
      }
    },
    // lame collide
    addCollider: function(obj){
      this.colliders.push(obj);
    },
    onCollide: function(){
      this.fill = "rgba(255, 0, 0, 0.3)";
      this.stroke = "rgba(255, 0, 0, 1)";
    },
    collideArea: 15,
    collide: function(){
      for (var i in this.colliders) {
        if (!this.colliders[i]) continue;
        var diffx = Math.abs(this.colliders[i].x - this.x),
            diffy = Math.abs(this.colliders[i].y - this.y);
        if (diffx < this.collideArea && diffy < this.collideArea) {
          if (removed.indexOf(this.colliders[i].id) !== -1) { // lame solution
            delete this.colliders[i];
          } else {
            this.onCollide(this.colliders[i]);
          }
        }
      }
    }
  };
  
  /* SONS */
  function Rect(x,y,width,height,fill){
    /* Todo: put default values */
    this.id = (++ids).toString();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fill = fill || "rgba(0, 0, 0, 0.2)";
    this.draw = function(can,con){
      con.fillStyle = this.fill;
      con.fillRect(this.x, this.y, this.width, this.height);
    };
  }
  function Circle(x,y,r,fill,stroke){
    fork(F.prototype,this); // FORKING
    this.id = (++ids).toString();
    this.x = x || 0;
    this.y = y || 0;
    this.r = r || 10;
    this.fill = fill || "rgba(255, 255, 255, 0.3)";
    this.stroke = stroke || "rgba(255, 255, 255, 1)";
    this.moves = [];
    this.rotation = 0;
    this.speed = {x:0,y:0};
    /* behavior variables */
    this.infiniteScope = null;
    /* Lame colliders */
    this.colliders = [];
    /* draw method */
    this.draw = function(can,con){
      // if out of space
      if (this.infiniteScope) this.foreverInScope(can,con);
      // add speed
      if (this.speed.x || this.speed.y) this.repos();
      con.translate(this.x,this.y);
      // rotate
      if (this.rotation) con.rotate(this.rotation);
      // collide
      if (this.colliders.length) this.collide();
      // make internal movements
      if (typeof(this.moves[0]) === "function") {
        this.moves[0].call(this,con);
        this.moves.shift();
      }
      // draw
      con.fillStyle = this.fill;
      con.strokeStyle = this.stroke;
      con.beginPath();
      con.arc(0,0, this.r, 0, Math.PI * 2);
      con.closePath();
      con.stroke();
      con.fill();
    };
  }
  function Path(x,y,v,fill,stroke){
    fork(F.prototype,this); // FORKING
    this.id = (++ids).toString();
    this.x = x || 0;
    this.y = y || 0;
    this.v = v || [];
    this.fill = fill || "rgba(255, 255, 255, 0.3)";
    this.stroke = stroke || "rgba(255, 255, 255, 1)";
    this.moves = [];
    this.rotation = 0;
    this.speed = {x:0,y:0};
    /* behavior variables */
    this.infiniteScope = null;
    /* Lame colliders */
    this.colliders = [];
    /* draw method */
    this.draw = function(can,con){
      // if out of space
      if (this.infiniteScope) this.foreverInScope(can,con);
      // add speed
      if (this.speed.x || this.speed.y) this.repos();
      con.translate(this.x,this.y);
      // rotate
      if (this.rotation) con.rotate(this.rotation);
      // collide
      if (this.colliders.length) this.collide();
      // make internal movements
      if (typeof(this.moves[0]) === "function") {
        this.moves[0].call(this,con);
        this.moves.shift();
      }
      // draw
      con.fillStyle = this.fill;
      con.strokeStyle = this.stroke;
      con.beginPath();
      for (var v in this.v){
        if (!v) con.moveTo(this.v[v][0],this.v[v][1]);
        else con.lineTo(this.v[v][0],this.v[v][1]);
      }
      con.closePath();
      con.stroke();
      con.fill();
    };
  }
  function Triangle(x,y,v,fill,stroke){
    x = x || 0;
    y = y || 0;
    v = v || [[0,-10],[-10,0],[10,0]];
    fill = fill || "rgba(255, 255, 255, 0.3)";
    stroke = stroke || "rgba(255, 255, 255, 1)";
    return new Path(x,y,v,fill,stroke);
  }
  // GO GO GO!!!
  function start(id,d,width,height,frame){
    _drawStack = {};
    ids = 0;
    removed = [];
    apply_draw = null;
    this.can = this.can || document.getElementById(id || "canvas");
    var win = getWindowSize();
    this.can.width = width || win.w;
    this.can.height = height || win.h;
    this.center = {x:win.w/2,y:win.h/2};
    this.con = this.con || this.can.getContext(d || "2d");
    this.clear = "rgba(0, 0, 0, 0.02)";
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(drawStack,this.frame);
    if (console && console.debug) console.debug(started);
    return started;
  }
  /* PUBLIC */
  return {
    can: null, //canvas
    con: null, //context
    start: start,
    draw: draw,
    remove: remove,
    Path: Path,
    Rect: Rect,
    Triangle: Triangle,
    Circle: Circle,
    frame: 33
  };
}());
 