/* canvas.js
 * By Daniel R. (sadasant.com)
 * for #jsve (groups.google.com/group/jsv)
 *
 * roids.js's objects rendered with canvas
 *
 */
 
var canvas = (function(){ //
  /* PRIVATE VARS */
  var started = "You've started canvas.js",
      _drawStack = [],
      apply_draw = null;
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
    var can = canvas.can,
        con = canvas.con;
    if (canvas.clear) {
      canvas.draw(new canvas.Rect(0, 0, can.width, can.height, this.clear),1);
    }
    for (var i in _drawStack){
      con.save();
      _drawStack[i].draw(con);
      con.restore();
    }
  }
  /* PUBLIC METHODS */
  function draw(obj,first){
    if (first) _drawStack.splice(0,0,obj);
    else _drawStack.push(obj);
  }
  /* MOTHERS */
  /* SONS */
  function Triangle(x,y,v,fill,stroke){
    this.x = x || 0;
    this.y = y || 0;
    this.v = v || [[0,-10],[-10,0],[10,0]];
    this.fill = fill || "rgba(150, 255, 0, 0.3)";
    this.stroke = stroke || "#96FF00";
    this.moves = [];
    this.rotation = 0;
    this.draw = function(con){
      con.translate(this.x,this.y);
      if (this.rotation) con.rotate(this.rotation);
      if (typeof(this.moves[0]) === "function") {
        this.moves[0].call(this,con);
        this.moves.shift();
      }
      con.fillStyle = this.fill;
      con.strokeStyle = this.stroke;
      con.beginPath();
      con.moveTo(this.v[0][0],this.v[0][1]);
      con.lineTo(this.v[1][0],this.v[1][1]);
      con.lineTo(this.v[2][0],this.v[2][1]);
      con.closePath();
      con.stroke();
      con.fill();
    };
  }
  function Rect(x,y,width,height,fill){
    /* Todo: put default values */
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fill = fill || "rgba(0, 0, 0, 0.2)";
    this.draw = function(con){
      con.fillRect(this.x, this.y, this.width, this.height);
    };
  }
  // GO GO GO!!!
  function start(id,d,width,height){
    this.can = document.getElementById(id || "canvas");
    var win = getWindowSize();
    this.can.width = width || win.w;
    this.can.height = height || win.h;
    this.center = {x:win.w/2,y:win.h/2};
    this.con = this.can.getContext(d || "2d");
    this.clear = "rgba(0, 0, 0, 0.05)";
    this.interval = setInterval(drawStack,33); // should be between 30 and 35
    if (console && console.debug) console.debug(started);
    return started;
  }
  /* PUBLIC */
  return {
    can: null, //canvas
    con: null, //context
    start: start,
    draw: draw,
    Triangle: Triangle,
    Rect: Rect
  };
}());
 