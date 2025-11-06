class Dot {
  constructor(x, y, SIZE, sp) {
    if(!x)x=0;
        if(!y)y=0;
    this.pos = createVector(x, y);
    this.x=this.pos.x;
    this.y=this.pos.y;
    this.num = 1;
    this.sp = sp;
    this.color = color(random(255), random(255), random(255));
    this.hit=false;


    this.show = () => {
      push();
      stroke(0, 100, 0);
      strokeWeight(0.005);
      fill('#ffffff55');
      image(Grr, this.pos.x, this.pos.y, SIZE, SIZE);
      // ellipse(this.pos.x+18, this.pos.y+18, SIZE+10);
      pop();
    };
    ///hit detection
    this.inc = [];
    this.inc.push("");
    this.hits = (inc) => {
      var d = dist(this.pos.x, this.pos.y, inc.pos.x, inc.pos.y);
      if (d < SIZE ) {
        this.hit=true;
        console.log('dot hit this -->' + inc,this.hit);
        
      }else {
        this.hit=false;
      }

    };

    ///
    this.move = () => {
      this.pos.x += this.sp;
      if (this.pos.x < 0 || this.pos.x > width - SIZE) {
        this.drop();
      }
      if (this.pos.y < 0 || this.pos.y > height - SIZE) {
        this.pos.x=0;
         this.pos.y=0;
      }
    };

    this.drop = () => {
      this.pos.y = SIZE + this.pos.y;
      this.sp = -this.sp;
      if (this.pos.y >h) {
        if (this.dt >= dot.length) {
          level++;
          this.sp++;
          this.pos.y = 100;
          this.pos.x = width / 2;
        }
      }
    };
  }
}
