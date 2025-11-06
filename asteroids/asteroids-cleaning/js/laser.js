class Laser {
  constructor(spos, angle) {

    this.pos = createVector(spos.x, spos.y);
    this.vel = p5.Vector.fromAngle(angle);
    this.vel.mult(10);
    this.contact = false;
    this.release = false;
    this.inc = [];
    this.inc.push("");
    this.r=2;
    this.update = function () {
      this.pos.add(this.vel);
      // if (this.contact) {
      //   resolve_contact();
      // }
      if (this.release) {
        // this.shoot();
      }
      if(this.contact){
        G.lasers.splice(0,1);
      }
    };

    this.render = function () {
      push();
      stroke(255);
      strokeWeight(4);
      ellipse(this.pos.x, this.pos.y, this.r);
      pop();

    };


  

    this.offscreen = function () {
      if (this.pos.x > width || this.pos.x < 0) {
        return true;
      }
      if (this.pos.y > height || this.pos.y < 0) {
        return true;
      }

    };

    // this.hits = function (inc) {
    // console.log("inside",this.pos.x, this.pos.y,inc.pos.x, inc.pos.y);
    //   let d = dist(this.pos.x, this.pos.y,inc.pos.x, inc.pos.y);
    //   d < this.r + this.inc.r ? () => {
    //     return this.contact = true,
    //     inc.contact = true;
    //   } : () => {
    //     return this.contact = false,
    //     inc.contact = false;
    //   };
    //   G.gameStats.laserContact = this.contact;
    //   console.log(G.gameStats.laserContact);
    // };

    // this.laserhits = function () {
    //   G.asteroids.forEach((l, index) => {
    //     // console.log(this,G.asteroids[index]);
    //     // this.hits(G.asteroids[index]);
    //     if (this.contact) {

    //       l.pts();
    //       G.bl.play();
    //       G.score += 10;
    //       console.log(l);
    //       this.contact ? console.log("laser has been hit", this.contact) : console.log("laser has not been hit", this.contact);

    //       if (l.r > 10) {
    //         if (G.asteroids.length <= 0) {
    //           return;
    //         }
    //         l.breakup();
    //         G.asteroids.splice(index, 1);
    //       }
    //       G.asteroids.splice(index, 1);
    //     }
    //   });
    // };
  }
}

function shoot() {

  for (let l = G.lasers.length - 1; l >= 0; l--) {

    let L = G.lasers[l];
    L.render();
    L.update();
    // L.laserhits();          
    // console.log()
    if (L.offscreen()) {
      G.lasers.splice(l, 1);
    }
    // if (G.asteroids.length <= 0) {
    //   G.level.push(l);
    //   new resetGame();
    // }
  }
}

// function drawLaser() {
//   if (G.laser.length >= 1) {
//     G.laser.forEach((l) => {
//       l.render();
//       l.update();
//       l.turn();

//     });
// // target(G.laser,G.asteroids);

//     //ship[0].defend();
//   } else {
//     gameOver();
//   }
// }

function target(a, b) {
   console.log("lazer target",a,b);
  if (a) {
    for (let j = a.length - 1; j >= 0; j--) {
      let A = a[j];
      if (b) {
        for (let i = b.length - 1; i >= 0; i--) {
          b[i].hits(A);
          if (!b) {
            return;
          } else if (b.contact) {
            G.bl.play();
            G.score += 1 * floor(A.r);
            A.pts();
            if (A.r > 15) {
              A.breakup();
              // G.score += 3 * floor(A.r);
            }
            a.splice(j, 1);
            b.splice(l, 1);
          }
        }
      }
    }
  }
}
