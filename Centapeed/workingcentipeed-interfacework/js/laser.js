
class Laser
{  
    constructor(spos, size){
      const t = this;
      t.pos = createVector(spos.x, spos.y);
      t.s = size=4;
      t.sp=8;
      t.cl = color(250,250 ,0 , 255);
      t.inc = [];
      t.inc.push("");
      t.hit=false;
    }
      show(){
        const t = this;
        stroke(t.cl);
        strokeWeight(t.s);
        noFill();
        point(t.pos.x, t.pos.y);
        
      }
      move(){const t = this; t.pos.y -= t.sp; }
      hits(inc){
        const t = this;
        var d = dist(t.pos.x, t.pos.y, inc.pos.x, inc.pos.y);
        if (d < t.s + inc.s) {
          inc.hit=true;
          t.hit=true;
         console.log( "laser Hit",t,inc);
          return true;
         }
        }
      offScreen(){
        const t = this;
        if (t.pos.x < 0 || t.pos.x > width) {
          lasers.splice(0, 1);
        }
        if (t.pos.y < 0 || t.pos.y > height) {
          lasers.splice(0, 1);
        }
      }
     }

loadLaser = (a) => {
  for (var l = 0; l < lasers.length; l++) {
    lasers[l].move();
    lasers[l].show();

    mush.forEach((m)=>{
      
       lasers[l].hits(m);
       if(m.hit){
        console.log("MUSHROOMS");  
        }
    });
   dots.forEach((d)=>{
    
    lasers[l].hits(d);
    if(d.hit){
    console.log("DOTS");  
    }
   });
    if (lasers[l].offScreen()) {
      lasers.splice(l, 1);

    }
  }
};
