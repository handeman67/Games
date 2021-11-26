function Asteroid(pos, r)
{
  let beat = 2000;
  //Create a vector position
  if (pos) {
    this.pos = pos.copy();
  } else {
    this.pos = createVector(random(width), random(height));
  }
  //Control radius
  if (r) {
    this.r = r * 0.5;
  } else {
    this.r = random(random(10, 15), 60);
  }
  // if (asteroids[0]) {
  //   this.ac = this.render;
  // }
//add a velocity
  this.vel = p5.Vector.random2D();
  // number of verticies
  this.total = floor(random(5, 10));
  //offset of verticies
  this.offset = [];
  for (var i = 0; i < this.total; i++) {
    this.offset[i] = random(-this.r * 0.25, this.r * 0.25);
  }

  this.update = function() {
    this.pos.add(this.vel);
  };

  this.render = function() {
    push();
    stroke(255);
    strokeWeight(2);
    fill(100, 100, 100, 125);
    translate(this.pos.x, this.pos.y);
    beginShape();
    for (var i = 0; i < this.total; i++) {
      var angle = map(i, 0, this.total, 0, TWO_PI);
      var r = this.r + this.offset[i];
      var x = r * cos(angle);
      var y = r * sin(angle);
      vertex(x, y);
         }
    endShape(CLOSE);
    pop();
  };

  this.pts = function() {
    push();
    parts = [];
    for (let i = 0; i < this.r; i++) {
      parts.push(new Particles(this.pos));
    }
    pop();
    return parts;
  };
  this.breakup = function(newA) {
    sm.play();
    bm.play();

    var newA = [];
    for (var j = 0; j < random(4); j++) {
      newA.push(new Asteroid(this.pos, this.r));
      score += 5;
    }
    return newA;
  };

  this.edges = function() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  };
}
