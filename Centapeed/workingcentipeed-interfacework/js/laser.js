
class Laser
{  
    constructor(spos, size){
      let t = this;
      t.pos = createVector(spos.x, spos.y);
      t.s = size=4;
      t.sp=8;
      t.cl = color(250,250 ,0 , 255);
    
      t.show = function ()
      {
        stroke(t.cl);
        strokeWeight(t.s);
        noFill();
        point(t.pos.x, t.pos.y);
        
      };
      t.move = () => { t.pos.y -= t.sp; };

      t.inc = [];
      t.inc.push("");
      function hits(inc){
        var d = dist(t.pos.x, t.pos.y, inc.pos.x, inc.pos.y);
        if (d < t.s + inc.s) {
         console.log( "laser Hit");
          return true;
         
        }
      
      }
      t.offScreen = () =>{
        if (t.pos.x < 0 || t.pos.x > width) {
          lasers.splice(0, 1);
        }
        if (t.pos.y < 0 || t.pos.y > height) {
          lasers.splice(0, 1);
        }
      };
    }
  }

loadLaser = () => {
  for (var l = 0; l < lasers.length; l++) {
    lasers[l].move();
    lasers[l].show();
    
    // for (let d of dots){
    //   if (dots[d].hits(lasers[l])) {
    //     console.log("hit")
    //     dots.splice(d, 1);
    //     lasers.splice(l, 1);
    //   }}
      
    if (lasers[l].offScreen()) {
      lasers.splice(l, 1);
    }
  }
};