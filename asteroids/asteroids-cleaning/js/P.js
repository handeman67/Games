class Particles {
  constructor(pos, r)
  {
    pos? this.pos = pos.copy():this.pos = createVector(0, 0);
    r? this.r = r:this.r = random(2, 15);
    this.vel = p5.Vector.random2D();
    this.force = floor(random(0, 50));
    this.vx = floor(random(-1.6,1.6));
    this.vy = floor(random(-1.6,1.6));
    this.col = random(255);
    this.alpha = 255;
    this.vl = this.vel + this.force;
    this.ran = floor(random(1, 2));
    this.offshape = 5 ;
  } 

  update() {
   // this.pos.add(this.vel);
    this.pos.x += this.vx;
    this.pos.y += this.vy;
    this.alpha -= 2;
  }
  show() {
    push();
     stroke(200,this.alpha); //
     strokeWeight(2);
    fill(255, 255, 255, this.alpha); //
    beginShape();
    for (var i = 0; i <G.parts.length; i++) {
   point(this.pos.x,this.pos.y,this.offshape);
     }
     endShape();
    pop();
  }
  cleared() {
    if (this.alpha <= 0) {
    return;
                         }
  }
}
