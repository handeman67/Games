class Particles {
  constructor(pos, r)
  {
    if (pos) {
      this.pos = pos.copy();
    } else {
      this.pos = createVector(0, 0);
    }
    if (r) {
      this.r = r;
    } else {
      this.r = random(2, 15);
    }

    this.vel = p5.Vector.random2D();
    this.force = floor(random(0, 50));
    this.vx = floor(random(sin(50),cos (120)));
    this.vy = floor(random(cos(150), sin(50)));
    this.col = random(255);
    this.alpha = 255;
    this.vl = this.vel + this.force;
    this.ran = floor(random(1, 8));
    this.offshape = floor(random(-this.r * 0.25, this.r * 0.25));
  }

  update() {
   // this.pos.add(this.vel);
    this.pos.x += this.vx;
    this.pos.y += this.vy;
    this.alpha -= 4;
  }
  show() {
    push();
     stroke(200,this.alpha); //
     strokeWeight(2);
    fill(255, 255, 255, this.alpha); //
    beginShape();
    for (var i = 0; i < this.r; i++) {
     var angle = map(this.r, 0, this.r, 0, TWO_PI);
     var r = this.r ;
    var x = r * sin(angle);
      var y = r* cos(angle);
     
      vertex(this.pos.x, this.pos.y);
    //ellipse(this.pos.x, this.pos.y, this.r);
     }
     endShape(CLOSE);
    // pop();

    //   push();
    //  stroke(255)
    //   fill(200, this.alpha);//

    pop();
  }
  cleared() {
    if (this.alpha <= 0) {
    return;
                         }
  }
}