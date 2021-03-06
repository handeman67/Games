class Laser {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.sp = -14;
    this.offScreen = () => {
      if (this.pos.y < 0 || this.pos.y > height) return lasers.splice(0, 1)
    };
    this.show = () => {
      return stroke(255, 0, 0), strokeWeight(5), noFill(), point(0, 0)
    };
    //
    this.inc = [];
    this.inc.push("");
    ///
    this.hits = (inc) => {
      var d = dist(this.pos.x, this.pos.y, inc.pos.x, inc.pos.y);
      if (d < this.r + inc.r) {
        console.log("HITlaser");
      }
    };
    ///
    this.move =()=>{ return this.pos.y += this.sp * 4};
  }
}