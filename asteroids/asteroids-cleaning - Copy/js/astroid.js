G.offset=[];
class Asteroid {
  constructor(pos, radius,v) {
    let beat = 2000, t = this;
    pos ? t.pos = pos.copy() : t.pos =
     createVector(random(width),random(height),random(width));
    radius ? t.r = radius + 1.5 : t.r = random(5, 60);
    
    t.vel = p5.Vector.random2D();
    t.vel.add(random(-1, 1) % t.r);
    v? t.vertices =floor(random(5,7)):t.vertices =floor(random(7, 10)); 
   
    // ;
    for (let i = 0; i < t.vertices; i++) {
      G.offset.push(random(2, t.r*0.25));
    }
  }
    update = function () {
      let t = this;
      t.pos.add(t.vel);
      // this.setRotation();
    };
 
    render = function () {
      let t = this;
      push();
      stroke(255);
      strokeWeight(2);
      fill(100, 100, 100, 125);
      translate(t.pos.x, t.pos.y);
      beginShape();
      // rotate(noise(0.005*this.r , .360*this.r));
      for (let i = 0; i < t.vertices; i++) {
        
        let angle = map(i, 0.5, t.vertices, 0, TWO_PI);
      
        let ro = t.r + G.offset[i];
        let x = ro * cos(angle)- atan(angle);
        let y = ro * sin(angle)- tan(-angle);
        vertex(x, y);
      }
      endShape(CLOSE);
      pop();
    };
 
    pts = function () {
      for (let i = 0; i <random(2,4); i++) {
        G.parts.push(new Particles(this.pos));
      }return G.parts;
    }
 
    breakup = function () {
      G.newA=[];
      let num=this.r/G.newA.length ;
      for (var j = 0; j < num; j++) {
        G.newA.push(new Asteroid(this.pos,G.newA.length*0.5,5));
      } return G.newA;
    };

    edges = function () {
      let t = this;

      if (t.pos.x > width + t.r) {
        t.pos.x = -t.r;
      } else if (t.pos.x < -t.r) {
        t.pos.x = width + t.r;
      }
      if (t.pos.y > height + t.r) {
        t.pos.y = -t.r;
      } else if (t.pos.y < -t.r) {
        t.pos.y = height + t.r;
      }
    };
  
}
