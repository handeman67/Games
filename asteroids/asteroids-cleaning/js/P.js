class Particles {
  constructor(pos, r) {
    pos ? this.pos = pos.copy() : this.pos = createVector(0, 0);
    r ? this.r = r : this.r = random(2, 5);
    this.vel = p5.Vector.random2D();
    this.force = floor(random(0, 1));
    this.vx = floor(random(-1.4, 1.5));
    this.vy = floor(random(this.vx*random(2)));
    this.col = random(255);
    this.alpha = 255;
    this.vl = this.vel + this.force;
    this.ran = floor(random(1, 2));
    this.offshape = 1;
  }

  update() {
    // this.pos.add(this.vel);
    this.pos.x += this.vx;
    this.pos.y += this.vy;
    this.alpha -= 2;
  }
  show() {
    push();
    beginShape();
    let num = random(this.offshape);
    for (var i = 0; i < G.parts.length; i++) {
      stroke(this.col, this.alpha); //
      strokeWeight(1);
      circle(this.pos.x, this.pos.y, num);
    }
    endShape();
    pop();
  }
  cleared() {
    if (this.alpha < 0) {
      return G.parts.splice(0, 1);
    }
  }
}

function drawParts() {
  for (let p = G.parts.length - 1; p > 0; p--) {
    let P = G.parts[p];
    P.show();
    P.update();
    P.cleared();
  }
}
