class Dot {
  constructor(pos, r, sp) {

    this.pos = createVector(this.x,this.y);
    this.num = 2;
    
    this.r = r;
    this.sp = 5;
    this.color= color(random(100), random(100), random(100))
   
    

    this.show = () =>
    {
      push();
      stroke(10, 255, 100, 100);
      strokeWeight(1);
      fill(this.color);
      
      textSize(20)
      text(this.num, this.pos.x, this.pos.y, 50, 50)
      
      ellipse(this.pos.x, this.pos.y, this.r);
      pop();
    };
    ///hit detection
    this.inc = [];
    this.inc.push("");
    this.hits = (inc) => {
      var d = dist(this.pos.x, this.pos.y, inc.pos.x, inc.pos.y);
      if (d < this.r + inc.r) {
        console.log("HITDOT")
        
      
           
        
      }
      
    };

    ///
    this.move = () => {
      this.pos.x = this.pos.x += this.sp;
      if (this.pos.x < 0 + this.r || this.pos.x > width - this.r) {
        this.drop();

      }
    };

    this.drop = () => {
      this.pos.y = this.r + this.pos.y;
      this.sp = -this.sp;
      if (this.pos.y > height - this.r) {
        if (this.dt >= dot.length) {
          level++
        }
        this.sp
        this.pos.y = 100;
        this.pos.x = width / 2;

      }
    };
  }
}