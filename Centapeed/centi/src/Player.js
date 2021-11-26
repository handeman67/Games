const createVector= require('P5')
class Player {
  constructor(x,y,size, sp, tool) {
    
    this.size = size;
    this.sp = sp;
    this.pos =createVector(x,y,sp);
     this.tool = tool = {};
    Edges();
    Keys();
    this.show = function () {
      strokeWeight(2);
      stroke(0, 255, 0);
      fill(255);
      ellipse(this.pos.x, this.pos.y, this.size);
    };
offscreen()
  }
}
let ff = new Player(100, 100, 50, 0.1)  

function  offscreen () {
      if (this.pos.x > width || this.pos.x < 0) {
        return true;
      }
      if (this.pos.y > height || this.pos.y < 0) {
        return true;
      }
    };
new Player()