G.lasers = [];
class Ship {
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
    this.green = 255 - this.damg;
    this.blue = 255 - this.damg;


    this.inc = [];
    this.inc.push("");
    this.boosting = function (b) {
      this.isBoosting = b;

    };
    this.setRotation = function (a) {
      this.rotation += a;
    }
  }

  render = function () {

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
  }
  update = function () {
    this.render();
    this.move();
    this.turn();
    this.edges();
    this.shiphits();
    if (this.isBoosting) {
      this.boost(0.5);
    }
    this.pos.add(this.vel);
    this.vel.mult(0.98);
  }

  thrust = function () {
    //this.vv =
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
    // G.thrust.play();
  }

  edges = function () {
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
  }

  boost = function (a) {
    let force = p5.Vector.fromAngle(this.heading);
    force.mult(a);
    this.vel.add(force);
    this.thrust();
  }

  hits = function (inc) {
    let d = dist(this.pos.x, this.pos.y, inc.pos.x, inc.pos.y);
    if (d < this.r + inc.r) {
      return true;
    }
  }

  turn = function () {
    this.heading += this.rotation;
  }

  shiphits = function () {
    for (let s = G.ship.length - 1; s >= 0; s--) {
      for (let j = G.asteroids.length - 1; j >= 0; j--) {
        if (G.ship[s].hits(G.asteroids[j])) {
          G.asteroids[j].pts();
          G.bl.play();
          G.score += -10;
          this.damg += 20;

          if (G.asteroids[j].r > 10) {
            G.asteroids[j].breakup();;
          }
          G.asteroids.splice(j, 1);
          break;
        }
      }
    }
  };

  move = function () {
    // console.log("move");

    if (keyIsDown((keyCode = 37))) {
      
      this.setRotation(-0.1);
      console.log("left",this.rotation);
    }
    if (keyIsDown((keyCode = 39))) {
      
     this.setRotation(0.1);
      console.log("right",this.rotation);
    }
    if (keyIsDown((keyCode = 38))) {
     
      this.boosting(true);
       console.log("down");
    }

    this.keyReleased = function (keyCode = 37 || 38) {
      
      this.setRotation(0);
      this.boosting(false);
      console.log("released");
    };

    this.keyPressed = function (e) {


      if (e.keyCode == 32) {
        G.lasers.push(new Laser(G.ship[0].pos, G.ship[0].heading));
        fire.play();
        console.log("fire");
      }
    };
  };
}
