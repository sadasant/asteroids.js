Hello guys.

Well... I thought on making the "same core" of calls to both of the
rendering options we're going to make (css and canvas), that core should be
"roids.js". I put some comments in roids.js, I'll fill others with time...

**What is done:**

* It shows a triangle in the center of the screen.
* It rotates with the left-right keys.
* Clearing rectangles works flawlessly.
* It's advancing forward in any direction
* It keeps advancing until you push te brake (down arrow)

**What should be done soon:**

* infinite canvas (?) I mean the background stuff that doesn't seems to end

**Mini-examples:**

* [Rotating a triangle with canvas](http://jsfiddle.net/sadasant/3sBRh/4/)

**Notes:**

* Converting radians to degrees: `Rad*(180/Math.PI)`
* Converting degrees to radians: `Deg*(Math.PI/180°)`

I guess that's it :D

\m/ Long live to *jsve*!