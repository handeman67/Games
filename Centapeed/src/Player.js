class Player {
  constructor(x,y,size, sp, tool) {  
    let t=this;  
    t.size = size||10;
    t.sp = sp;
    t.pos =createVector(x,y,sp);
     t.tool = tool = {};
    Edges();
    Keys();
    show()
offscreen()
  }
}

function show() {
      strokeWeight(2);
      stroke(0, 255, 0);
      fill(255);
      ellipse(this.pos.x, this.pos.y, this.size);
    };
function  offscreen () {
      if (this.pos.x > width || this.pos.x < 0) {
        return true;
      }
      if (this.pos.y > height || this.pos.y < 0) {
        return true;
      }
    };
