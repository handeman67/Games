class Ball extends Block {
  constructor(x, y, r) {
    super(x, y, r);

    !x ? this.x = vrs.center : this.x = x;
    !y ? this.y = vrs.bottom : this.y = y;
    !r ? this.r = vrs.Size * 2 : this.r = r;
    this.mass = this.r * this.r / vrs.Size * 2;
    this.direct = vrs.positive,
      this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(1);

  }
  update_b() {
    let e = this;
    // if(e.vel<0){e.vel=size}     
    e.acc.add(e.gravforce);
    e.acc.setMag(vrs.mag);
    e.vel.add(e.acc);
    e.pos.add(e.vel);

    // this.vel.mult(this.negative)
  }


  show_b() {
    let e = this;
    fill(100, 100, 0);
    push();
    translate(e.pos.x, e.pos.y);
    ellipse(0, 0, e.r);
    pop();

  }


  


}