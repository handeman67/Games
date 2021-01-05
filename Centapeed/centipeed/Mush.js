class Mush {

  constructor(x, y, SIZE) {
    this.pos = createVector(x, y);
    // this.sp = 5;
    this.show = () => {
      stroke(10, 255, 100, 255);
      strokeWeight(1);
      fill(100, 100, 100, 255);
      image(mushroom, this.x * SIZE, this.y * SIZE, SIZE, SIZE);
      ellipse(this.pos.x, this.pos.y, SIZE);
    };
    this.update = () => {
      //this.r=this.r-1
    };
    ///hit detection
    this.inc = [];
    this.inc.push("");
    this.hits = (inc) => {
      var d = dist(this.pos.x, this.pos.y, inc.pos.x, inc.pos.y);
      if (d < SIZE + inc.SIZE) {

        return true;
      }
    };
  }
}
