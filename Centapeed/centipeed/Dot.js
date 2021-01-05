class Dot {
  constructor(x, y, SIZE, sp) {
    if(!x)x=0,this.x=x;
    if(!y)y=0,this.y=y;
        
    this.pos = createVector(this.x, this.y);
    this.num = 2;
    this.sp = sp;
    this.color = color(random(255), random(255), random(255));



    this.show = () => {
      push();
      stroke(0, 100, 0);
      strokeWeight(.005);
      fill('#ffffff55');
      image(smile, this.pos.x, this.pos.y, SIZE, SIZE);
      ellipse(this.pos.x, this.pos.y, SIZE);
      pop();
    };
    ///hit detection
    this.inc = [];
    this.inc.push("");
    this.hits = (inc) => {
      var d = dist(this.pos.x, this.pos.y, inc.pos.x, inc.pos.y);
      if (d < SIZE + inc.SIZE) {

        console.log('dot hit this -->' + inc);


      }

    };

    ///
    this.move = () => {
      this.pos.x = this.pos.x += this.sp;
      if (this.pos.x < 0 || this.pos.x > width - SIZE) {
        this.drop();


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
