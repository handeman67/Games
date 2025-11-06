G.lasers = [];
class Ships {
  constructor() {
    this.pos = createVector(width / 2, height / 2);
    this.r = 10;
    this.heading = 0;
    this.rotation = 0;
    this.vel = createVector(0, 0);
    this.isBoosting = false;
    this.damg = 0;
    this.v = 255;
    this.v1 = 0;
    this.v2 = random(255);
    this.red = 255;
    this.green = 255;
    this.blue = 255;
    this.Moves = false;
    this.contact = false;
    this.num = this.heading * PI;
    this.inc = [];
    this.inc.push("");
    this.gs = G.gameStats;
    this.boosting = function (b) {
      this.isBoosting = b;
    };

    this.render = function (a) {
      push();
      translate(this.pos.x, this.pos.y);
      rotate(this.heading + PI / 2);
      this.shipFrame = stroke(0, 0, 255);
      fill(this.red, this.green, this.blue);
      triangle(-this.r, this.r, this.r, this.r, 0, -this.r);
      noStroke();
      fill(0);
      triangle(-this.r + 4, this.r - 4, this.r - 4, this.r - 5, 0, -this.r + 20);
      pop();
    };

    this.update = function () {
      if (this.isBoosting) {
        this.boost(0.5);
      }
      if (this.contact) {
        resolve_contact();
      }
      this.pos.add(this.vel);
      this.vel.mult(0.98);
      keyReleased();
      keyPressed();
      this.edges();
      this.green - this.damg;
      this.blue - this.damg;
      // this.contact?console.log("ship has been hit",this.contact):console.log("ship has not been hit",this.contact);
      // console.log(rotate());
    };

    this.thrust = function () {
      push();
      translate(this.pos.x, this.pos.y);
      rotate(this.heading + PI / 2);
      stroke(this.v, this.v - 50, this.v2, this.v);
      strokeWeight(random(2));
      fill(this.v, this.v, this.v1 + this.v2, this.v2);
      beginShape();
      triangle(
        -this.r + 2,
        this.r - 2,
        this.r - 2,
        this.r - 2,
        0,
        -this.r + random(20, 40)
      );
      endShape();
      pop();
      G.thruster.play();
    };

    this.edges = function () {
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

    this.boost = function (a) {
      let force = p5.Vector.fromAngle(this.heading);
      force.mult(a);
      this.vel.add(force);
      this.thrust();
    };
    //  this.hits= new it_hit()

    // this.hits = function () {

    //   let d = dist(this.pos.x, this.pos.y, this.inc.pos.x, this.inc.pos.y);
    //   d < this.r + this.inc.r ? () => {
    //     return this.contact = true,
    //     this.inc.contact = true
    //   } : () => {
    //     return this.contact = false,
    //     this.inc.contact = false;
    //   };
    //   G.gameStats.shipContact = this.contact;
    //   console.log(G.gameStats.shipContact);
    // };

    this.turn = function () {
      this.heading += this.rotation;
      G.gameStats.headings = this.heading;
    };
  }
}

function shipDamage(a) {
  if (G.ship[0]) {
    if (G.ship[0].damg >= a) {
      G.ship.splice(0, 1);
    }
    return G;
  }
}

function clearShip() {
  if (G.ship.length <= 0 || undefined) {
    return;
  }
  if(G.ship[0]){
  if (G.ship[0].damg >= 250) {
    G.ship[0].splice(0, 1);
  }
  return G;
}}
let cnt = 0;

function resolve_contact() {
  cnt++;
  G.asteroids.forEach((a, index) => {

    if (a.contact) {

      G.bl.play();
      G.score += -10;
      G.ship[0].damg += 20;
      let limit = 25;
      // console.log(a.r);
      if (a.r > limit) {
        if (G.asteroids.length <= 0) {
          return;
        }
        a.breakup();
        G.asteroids.splice(index, 1);
      } else {
        G.asteroids.splice(index, 1);
       
      }
    }
  });

}

function drawShip() {
  if (G.ship.length >= 1) {
    let s = G.ship[0];
    s.render(this.damg);
    s.update();
    s.turn();
    shoot();
    clearShip();
    //ship[0].defend();
  } else {
    gameOver();
  }
}
