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
    if (this.clear) {
      this.draw(new this.Rect(0, 0, can.width, can.height, this.clear));
    }
    for (var i in _drawStack){
      con.save();
      _drawStack[i].draw(con);
      con.restore();
    }
  }
  /* PUBLIC METHODS */
  function draw(obj){
    _drawStack.push(obj);
  }
  /* MOTHERS */
  /* SONS */
  function Triangle(v,fill,stroke){
    this.v = v || [[25,25],[105,25],[25,105]];
    this.fill = fill || "rgba(150, 255, 0, 0.3)";
    this.stroke = stroke || "#96FF00";
    this.moves = [];
    this.rotate = function(rad){
      this.moves.push(function (con) {
        console.debug(rad);
        con.translate(this.v[0][0],this.v[0][1]);
        con.rotate(rad); // not working
      });
    };
    this.draw = function(con){
      console.debug(this.stroke);
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
  // GO GO GO!!!
  function start(id,d,width,height){
    this.can = document.getElementById(id || "canvas");
    var win = getWindowSize();
    this.can.width = win.w;
    this.can.height = win.h;
    this.center = {x:win.w/2,y:win.h/2};
    this.con = this.can.getContext(d || "2d");
    this.can.width = width || this.can.width;
    this.can.height = height || this.can.height;
    this.clear = "rgba(0, 0, 0, 0.05)";
    this.interval = setInterval(drawStack,3333); // should be between 30 and 35
    if (console && console.debug) console.debug(started);
    return started;
  }
  /* PUBLIC */
  return {
    can: null, //canvas
    con: null, //context
    start: start,
    draw: draw,
    Triangle: Triangle
  };
}());
 