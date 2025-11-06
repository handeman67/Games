class Asteroid {
  constructor(pos, radius, v) {
    let beat = 2000;
    let t = this;
    pos ? t.pos = pos.copy() : t.pos =
      createVector(random(width), random(height), random(width));
    radius ? t.r = radius * 0.5 : t.r = random(5, 60);
    t.contact = false;
    t.vel = p5.Vector.random2D();
    t.vel.add(random(-.01, .001) % t.r);
    v ? t.vertices = v : t.vertices = floor(random(7, 10));
    t.inc = [];
    t.inc.push("");
    // ;
    for (let i = 0; i < t.vertices; i++) {
      G.offset.push(random(2, t.r * 0.25));
    }
  }

  update() {
    let t = this;
    t.pos.add(t.vel);
    if (this.contact == true) {
      // console.log("its been hit");
      // G.asteroids.splice(0, 1);
    }
  }

  render() {
    let t = this;
    push();
    stroke(255);
    strokeWeight(2);
    fill(100, 100, 100, 125);
    translate(t.pos.x, t.pos.y);
    beginShape();
    rotate(noise(0.005 * this.r, 0.360 * this.r));

    for (let i = 0; i < t.vertices; i++) {
      let ro = t.r + G.offset[i];
      let angle = map(i, 0.5, t.vertices, 0, TWO_PI);

      // rotate(360);
      let x = ro * cos(angle) - atan(angle);
      let y = ro * sin(angle) - tan(-angle);
      vertex(x, y);
    }

    endShape(CLOSE);
    pop();

  }
  pts() {
    for (let i = 0; i < 15; i++) {
      let offset = random(this.r) * this.heading;
      G.parts.push(new Particles(this.pos.add(this.r * offset), 20));
    }
    return G.parts;
  }
  hits(inc) {
    let d = dist(this.pos.x, this.pos.y, inc.pos.x, inc.pos.y);
    // console.log("LASER SIZE",inc.r);
    if (d < this.r + inc.r+5) {
      this.contact = true;
      inc.contact = true;
      // console.log("true",d);
      return this.contact;
    } else {
      // console.log("false",d)
      this.contact = false;
      return this.contact;

    }
  }

  breakup() {
    G.newA = [];
    let numb = Math.floor(random(2, 4));
    this.pts();
    for (var i = 0; i < numb; i++) {
      let direction = [
        this.heading - this.r, -this.heading + this.r
      ];
      let rand = floor(random(this.r));
      let offset = random(direction);

      G.asteroids.push(new Asteroid(this.pos.add(offset), rand));
      // G.newA.push(new Asteroid(this.pos.add(this.r),rand ));
    }

  }


  edges() {
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
  }
}
function checkhit(sps,lazers,a){
    if (sps) {
      sps.forEach((shp)=>{
        if(shp){
          a.forEach((ast)=>{ast.hits(shp);
             console.log("inside ships");
          });
        }
      });
    }
   if (lazers) {
      lazers.forEach((lsr)=>{
        if(lsr ){
          a.forEach((ast)=>{
            ast.hits(lsr);
           console.log("inside lasers");
          });
           
          
         
        }
        
      });

    }

}
function drawAsteroid() {
    const a = G.asteroids,
    lazers=G.lasers,
    sps=G.ship;
  for (let j = 0; j < a.length; j++) {
  
    checkhit(sps,lazers,a);

    // if (G.lasers) {
    //   G.lasers.forEach((l) => {
    //     a.hits(l);
    //   });
    //     }
    //       if (G.asteroids[j]) {
    //         a.hits(G.asteroids[j]);
    //       }
      if(a <= 0){
G.level += 1;
resetGame.makeast();
      }
        a.forEach((ast)=>{ 
          ast.render();
          ast.update();
          ast.edges();});
        // G.lasers.forEach((ll)=>{
        //  a.hits(ll);});

        //   for (let k = G.asteroids.length - 1;k >= 0; k--) {
        //      let b =G.asteroids[k];
        //     //  console.log("drawing");
        //     new it_hit(a,b);
        //     if(G.asteroids[k].contact||G.asteroids[j].contact){
        //       G.asteroids[k].breakup();
        //       G.asteroids[j].breakup();
        //     }
        // }
    
    }
  }
