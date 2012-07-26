// Ink.js
// By Daniel R. (sadasant.com)
// License: http://opensource.org/licenses/mit-license.php
// Homepage: https://github.com/sadasant/Ink.js
~function(e){function E(){if(v)return h(E);h(E);var e;for(e in s)s[e]&&(f.save(),s[e].draw(),f.restore());c.drawImage(a,0,0)}function S(e){s[e.id]=e}function x(e){e&&(u[e.id]=!0,delete s[e.id])}function N(e){e||(e={});var t=r.create(T.geometrics),n,s,u;return t.id=""+(o+=1),t.x=e.x,t.y=e.y,t.width=e.width,t.height=e.height,t.half_width=e.width/2,t.half_height=e.height/2,t._x=e._x!==i?e._x:e.x-t.half_width,t._y=e._y!==i?e._y:e.y-t.half_height,t.fill=e.fill||"rgba(0, 0, 0, 0.2)",t.border_color=e.border_color||"rgba(0, 0, 0, 0.2)",t.border_width=e.border_width||0,t.border_radius=e.border_radius||0,t.border_radius&&(n=[t.x-t.width-t.border_radius,t.x-t.width,t.x-t.border_radius*2,t.x-t.border_radius,t.y-t.height-t.border_radius,t.y-t.height,t.y-t.border_radius*2,t.y-t.border_radius],t.path=[[n[1],n[4]],[n[2],n[4],n[3],n[4],n[3],n[5]],[n[3],n[6],n[3],n[7],n[2],n[7]],[n[1],n[7],n[0],n[7],n[0],n[6]],[n[0],n[5],n[0],n[4],n[1],n[4]]],delete n),t.rotation=0,t.speed={x:0,y:0},t.maxSpeed={x:10,y:10},t.infiniteScope=null,t.colliders=[],t.draw=t.border_radius?O:C,t.afterDraw=i,t}function C(){this.infiniteScope&&this.foreverInScope(),(this.speed.x||this.speed.y)&&this.repos(),f.translate(this.x,this.y),this.rotation&&f.rotate(this.rotation),this.colliders.length&&this.collide(),f.fillStyle=this.fill,f.strokeStyle=this.border_color,f.lineWidth=this.border_width,f.fillRect(this._x,this._y,this.width,this.height),this.afterDraw&&this.afterDraw()}function k(e){e||(e={});var t=Object.create(T.geometrics);return t.id=(o+=1).toString(),t.x=e.x||0,t.y=e.y||0,t.r=e.r||0,t.fill=e.fill||"rgba(255, 255, 255, 0.3)",t.border_color=e.border_color||"rgba(0, 0, 0, 0.2)",t.border_width=e.border_width||0,t.rotation=0,t.speed={x:0,y:0},t.maxSpeed={x:10,y:10},t.infiniteScope=null,t.colliders=[],t.draw=L,t.afterDraw=i,t}function L(){this.infiniteScope&&this.foreverInScope(),(this.speed.x||this.speed.y)&&this.repos(),f.translate(this.x,this.y),this.rotation&&f.rotate(this.rotation),this.colliders.length&&this.collide(),f.fillStyle=this.fill,f.strokeStyle=this.border_color,f.lineWidth=this.border_width,f.beginPath(),f.arc(0,0,this.r,0,g),f.closePath(),f.stroke(),f.fill(),this.afterDraw&&this.afterDraw()}function A(e){e||(e={});var t=Object.create(T.geometrics);return t.id=(o+=1).toString(),t.x=e.x,t.y=e.y,t.path=e.path||[],t.fill=e.fill||"rgba(255, 255, 255, 0.3)",t.border_color=e.border_color||"rgba(0, 0, 0, 0.2)",t.border_width=e.border_width||0,t.rotation=0,t.speed={x:0,y:0},t.maxSpeed={x:10,y:10},t.infiniteScope=null,t.colliders=[],t.draw=O,t.afterDraw=i,t}function O(){this.infiniteScope&&this.foreverInScope(),(this.speed.x||this.speed.y)&&this.repos(),f.translate(this.x,this.y),this.rotation&&f.rotate(this.rotation),this.colliders.length&&this.collide(),f.fillStyle=this.fill,f.strokeStyle=this.border_color,f.lineWidth=this.border_width,f.beginPath();var e=0,t=this.path.length,n;for(;e!==t;e+=1)n=this.path[e],e?f.lineTo(n[0],n[1]):f.moveTo(n[0],n[1]),n.length===6&&f.quadraticCurveTo(n[2],n[3],n[4],n[5]);f.closePath(),f.stroke(),f.fill(),this.afterDraw&&this.afterDraw()}function M(e){e||(e={});if(typeof e.type!="string")return;e.type=e.type.toUpperCase();var t;switch(e.type){case"LINEAR":t=f.createLinearGradient(e.x1,e.y1,e.x2,e.y2);break;case"RADIAL":t=f.createRadialGradient(e.x1,e.y1,e.r1,e.x2,e.y2,e.r2)}return t.colors=T.grad.colors,t}function _(){v=!1,d||(d=!0,E())}function D(e){e||(e={}),v=!0,s={},o=0,u={},this.dcan=l=this.dcan||t.getElementById(e.id||"canvas"),this.dcon=c=this.dcon||l.getContext("2d"),this.can=a=this.can||t.createElement("canvas"),this.con=f=this.con||a.getContext("2d"),a.height=l.height=e.height||p.h,a.width=l.width=e.width||p.w;if(!e.width||!e.height)t.body.style.overflow="hidden",l.style.margin="-8px -8px";return this.center={x:p.w/2,y:p.h/2},e.clear&&P.draw(new P.Rect({_x:0,_y:0,width:a.width,height:a.height,fill:e.clear})),setTimeout(_,100)}var t=e.document,n=e.Math,r=e.Object,i,s={},o=0,u={},a,f,l,c,h,p,d,v,m=n.PI/180,g=n.PI*2,y=n.cos,b=n.sin,w=n.abs;h=function(){return e.requestAnimationFrame||e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame||e.oRequestAnimationFrame||e.msRequestAnimationFrame||function(t){e.setTimeout(t,1e3/60)}}().bind(e),p=function(){return{w:e.innerWidth||t.documentElement&&t.documentElement.offsetWidth||t.body&&t.body.offsetWidth||630,h:e.innerHeight||t.documentElement&&t.documentElement.offsetHeight||t.body&&t.body.offsetHeight||460}}();var T={geometrics:{foreverInScope:function(){this.x>a.width-10&&(this.x-=a.width),this.x<-10&&(this.x+=a.width-10),this.y>a.height&&(this.y-=a.height),this.y<-10&&(this.y+=a.height)},rotateTo:function(e){this.rotation=e*m},accel:function(e,t){t&&(this.maxSpeed.x=t,this.maxSpeed.y=t);if(this.rotateInEdge){var n=this.rotation,r=-e*b(n),i=e*y(n);this.speed.x+=r,this.speed.y+=i}else this.speed.x+=e,this.speed.y+=e;var s={x:w(this.speed.x),y:w(this.speed.y)};s.x>this.maxSpeed.x&&(this.speed.x=s.x/this.speed.x*this.maxSpeed.x),s.y>this.maxSpeed.y&&(this.speed.y=s.y/this.speed.y*this.maxSpeed.y)},stop:function(){this.speed.x=0,this.speed.y=0},repos:function(){if(this.rotateInEdge)this.x-=this.speed.x,this.y-=this.speed.y;else{var e=this.rotation;this.x+=this.speed.x*b(e),this.y-=this.speed.y*y(e)}this._x=this.x-this.half_width,this._y=this.y-this.half_height},addCollider:function(e){this.colliders[this.colliders.length]=e},onCollide:function(){this.fill="rgba(255, 0, 0, 0.3)",this.stroke="rgba(255, 0, 0, 1)"},collideArea:15,collide:function(){var e=this.colliders,t,n=0,r=e.length,i,s;for(;n!==r;n+=1)if(t=e[n])i=w(t.x-this.x),s=w(t.y-this.y),i<this.collideArea&&s<this.collideArea&&(u[t.id]?delete this.colliders[n]:this.onCollide(t))}},grad:{colors:function(e){var t=0,n=e.length,r;for(;t!==n;t+=1)r=e[t],this.addColorStop(r[0],r[1]);return this}}},P=e.Ink={VERSION:"0.3.5",can:null,con:null,init:D,draw:S,remove:x,Path:A,Rect:N,Circ:k,grad:M,reqAF:h}}(this);