class Laser {
  constructor(spos, angle, SIZE) {
    this.hit = false;
    this.sp = 5;
    this.angle = 0;
    this.heading = 180;
    this.pos = createVector(spos.x, spos.y - 10);
    this.vel = p5.Vector.fromAngle(this.heading);
    this.heading += rotate;
    this.vel.mult(0.9);
    this.update = () => {
      this.pos.add(this.vel);
    };

    this.show = () => {
      push();
      stroke(255);
      strokeWeight(SIZE * 2);
      fill(100, 255, 200);
      point(this.pos.x, this.pos.y - 10);
      pop();
    };
    this.inc = [];
    this.inc.push("");
    this.hits = (inc) => {
      var d = dist(this.pos.x, this.pos.y, inc.pos.x, inc.pos.y);
      if (d < SIZE + inc.SIZE) {


        if (this.hit = true) {
          lasers.slice(1, 1);
        }
      }
    };

    this.move = () => {
      this.pos.y -= this.sp;
    };
    this.offScreen = () => {
      if (this.pos.x < 0 || this.pos.x > width) {
        lasers.splice(0, 1);
      }
      if (this.pos.y < 0 || this.pos.y > height) {
        lasers.splice(0, 1);
      }
    };
  }
}
