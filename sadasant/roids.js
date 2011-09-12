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
  
  /* The Ship class.
   */
  function Ship(R){
    if (!R) return;
    this.obj = new R.Triangle(R.center.x,R.center.y,[[0,-10],[-10,0],[10,0]]);
    R.draw(this.obj);
  }
  // This should be in a parent, not sure...
  Ship.prototype = { //
    turn: function(to){
      var rad = Math.PI/30 * ((to === "left")? -1 : 1);
      this.obj.rotation+=rad;
    },
    accelerator: function(much){
      this.obj.run();
    },
    brake: function(much){
      much = much || -30;
      console.debug("Going forward with "+much+" grades of speed.");
    }
  };

  /* The start function
   * "Where everything begins"
   * The R argument will decide if we'll work with canvas or css
   * for that, we must put the same functions and variables in both methods
   */
  function start(R){
    this.R = R; // this should do the reference to the render class
    this.R.start(); // setting the renderer
    this.hero = new Ship(R); // or this.Ship
    // keyboarding!!!
    document.addEventListener("keydown",function (e) {
      switch (e.charCode || e.keyCode){ //
        // turning
        case 37:roids.hero.turn("left");  break;
        case 39:roids.hero.turn("right"); break;
        // accelerator
        case 38:roids.hero.accelerator(); break;
        // brake
        case 40:roids.hero.brake(); break;
      }
    },true);
    if (console && console.debug) console.debug(started);
    return started;
  }

  // This is the real object
  return {
    R: null, // here will be stored the rendering method
    hero: null, // our hero (Ship object)
    start: start // Go go go!
  };
}());