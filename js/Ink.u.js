// Ink.js
// By Daniel R. (sadasant.com)
// License: http://opensource.org/licenses/mit-license.php
// Homepage: https://github.com/sadasant/Ink.js
~function(a,b,c,d){function u(){if(o)return l(u);l(u);for(var a in e)e[a]&&(i.save(),e[a].draw(),i.restore());k.drawImage(h,0,0)}function v(a){e[a.id]=a}function w(a){a&&(g[g.length]=a.id,delete e[a.id])}function x(a,b){for(var c in a)a.hasOwnProperty(c)&&(b[c]=a[c])}function z(a,b,c,d,e,g){x(y.geometrics,this),this.id=(++f).toString(),this.x=a,this.y=b,this.width=c,this.height=d,this.fill=e||"rgba(0, 0, 0, 0.2)",this.stroke=g||"rgba(0, 0, 0, 0.2)",this.rotation=0,this.speed={x:0,y:0},this.maxSpeed={x:10,y:10},this.infiniteScope=null,this.colliders=[],this.afterDraw=undefined,this.draw=function(){this.infiniteScope&&this.foreverInScope(),(this.speed.x||this.speed.y)&&this.repos(),i.translate(this.x,this.y),this.rotation&&i.rotate(this.rotation),this.colliders.length&&this.collide(),i.fillStyle=this.fill,i.strokeStyle=this.stroke,i.fillRect(this.x,this.y,this.width,this.height),this.afterDraw&&this.afterDraw()}}function A(a,b,c,d,e){x(y.geometrics,this),this.id=(++f).toString(),this.x=a||0,this.y=b||0,this.r=c||0,this.fill=d||"rgba(255, 255, 255, 0.3)",this.stroke=e||"rgba(255, 255, 255, 1)",this.rotation=0,this.speed={x:0,y:0},this.maxSpeed={x:10,y:10},this.infiniteScope=null,this.colliders=[],this.draw=function(){this.infiniteScope&&this.foreverInScope(),(this.speed.x||this.speed.y)&&this.repos(),i.translate(this.x,this.y),this.rotation&&i.rotate(this.rotation),this.colliders.length&&this.collide(),i.fillStyle=this.fill,i.strokeStyle=this.stroke,i.beginPath(),i.arc(0,0,this.r,0,q),i.closePath(),i.stroke(),i.fill()}}function B(a,b,c,d,e){x(y.geometrics,this),this.id=(++f).toString(),this.x=a,this.y=b,this.v=c||[],this.fill=d||"rgba(255, 255, 255, 0.3)",this.stroke=e||"rgba(255, 255, 255, 1)",this.rotation=0,this.speed={x:0,y:0},this.maxSpeed={x:10,y:10},this.infiniteScope=null,this.colliders=[],this.draw=function(){this.infiniteScope&&this.foreverInScope(),(this.speed.x||this.speed.y)&&this.repos(),i.translate(this.x,this.y),this.rotation&&i.rotate(this.rotation),this.colliders.length&&this.collide(),i.fillStyle=this.fill,i.strokeStyle=this.stroke,i.beginPath();for(var a=0,b=this.v.length;a<b;a++)a?i.lineTo(this.v[a][0],this.v[a][1]):i.moveTo(this.v[a][0],this.v[a][1]);i.closePath(),i.stroke(),i.fill()}}function C(a,b,c,d,e,f,g){var h;return a=="LINEAR"?h=i.createLinealGradient(b,c,d,e):a=="RADIAL"&&(h=i.createRadialGradient(b,c,d,e,f,g)),h.colors=y.grad.colors,h}function D(){o=!1,n||(n=!0,u())}function E(a,c,d,l){o=!0,e={},f=0,g=[],this.dcan=j=this.dcan||b.getElementById(a||"canvas"),this.dcon=k=this.dcon||j.getContext("2d"),this.can=h=this.can||b.createElement("canvas"),this.con=i=this.con||h.getContext("2d"),h.height=j.height=d||m.h,h.width=j.width=c||m.w;if(!c||!d)b.body.style.overflow="hidden",j.style.margin="-8px -8px";return this.center={x:m.w/2,y:m.h/2},l=l!==undefined?l:"rgba(0, 0, 0, 1)",l&&F.draw(new F.Rect(0,0,h.width,h.height,l),1),setTimeout(D,this.frame<<2)}var e={},f=0,g=[],h,i,j,k,l,m,n,o,p=c.PI/180,q=c.PI*2,r=c.cos,s=c.sin,t=c.abs;l=function(){return a.requestAnimationFrame||a.webkitRequestAnimationFrame||a.mozRequestAnimationFrame||a.oRequestAnimationFrame||a.msRequestAnimationFrame||function(b){a.setTimeout(b,1e3/60)}}().bind(a),m=function(){return{w:a.innerWidth||b.documentElement&&b.documentElement.offsetWidth||b.body&&b.body.offsetWidth||630,h:a.innerHeight||b.documentElement&&b.documentElement.offsetHeight||b.body&&b.body.offsetHeight||460}}();var y={geometrics:{foreverInScope:function(){this.x>h.width-10&&(this.x-=h.width),this.x<-10&&(this.x+=h.width-10),this.y>h.height&&(this.y-=h.height),this.y<-10&&(this.y+=h.height)},rotateTo:function(a){this.rotation=a*p},accel:function(a,b){b&&(this.maxSpeed.x=b,this.maxSpeed.y=b);if(this.rotateInEdge){var c=this.rotation,d=-a*s(c),e=a*r(c);this.speed.x+=d,this.speed.y+=e}else this.speed.x+=a,this.speed.y+=a;var f={x:t(this.speed.x),y:t(this.speed.y)};f.x>this.maxSpeed.x&&(this.speed.x=f.x/this.speed.x*this.maxSpeed.x),f.y>this.maxSpeed.y&&(this.speed.y=f.y/this.speed.y*this.maxSpeed.y)},stop:function(){this.speed.x=0,this.speed.y=0},repos:function(){if(this.rotateInEdge)this.x-=this.speed.x,this.y-=this.speed.y;else{var a=this.rotation;this.x+=this.speed.x*s(a),this.y-=this.speed.y*r(a)}},addCollider:function(a){this.colliders[this.colliders.length]=a},onCollide:function(){this.fill="rgba(255, 0, 0, 0.3)",this.stroke="rgba(255, 0, 0, 1)"},collideArea:15,collide:function(){var a=this.colliders,b;for(var c=0,d=a.length;c<d;c++)if(b=a[c]){var e=t(b.x-this.x),f=t(b.y-this.y);e<this.collideArea&&f<this.collideArea&&(~g.indexOf(b.id)?delete this.colliders[c]:this.onCollide(b))}}},grad:{colors:function(a){for(var b=0,c=a.length;b<c;b++){var d=a[b];this.addColorStop(d[0],d[1])}return this}}},F=a.Ink={VERSION:"0.3.13",can:null,con:null,init:E,draw:v,remove:w,fork:x,Path:B,Rect:z,Circ:A,grad:C,frame:31,reqAF:l}}(window,document,Math);