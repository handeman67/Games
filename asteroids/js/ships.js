function Ship() {
  this.pos = createVector(width / 2, height / 2);
  this.r = 10;
  this.heading = 0;
  this.rotation = 0;
  this.vel = createVector(0, 0);
  this.isBoosting = false;
  this.damg = 0;
  this.boosting = function(b) {
    this.isBoosting = b;
  };
  
  this.render = function(x, y) {
    let red = 255;
    let green = 255 - damg;
    let blue = 255 - damg;
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading + PI / 2);
    this.shipFrame = stroke(0, 0, 255);
    fill(red, green, blue);
    triangle(-this.r, this.r, this.r, this.r, 0, -this.r);
    noStroke();
    fill(0);
    triangle(-this.r + 4, this.r - 4, this.r - 4, this.r - 5, 0, -this.r + 20);
    pop();
  };
  this.update = function() {
    if (this.isBoosting) {
      this.boost();
    }
    this.pos.add(this.vel);
    this.vel.mult(0.98);
  };

  this.thrust = function() {
    this.v = 255;
    this.v1 = 0;
    this.v2 = random(255);
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
    thrust.play();
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

  this.boost = function() {
    var force = p5.Vector.fromAngle(this.heading);
    force.mult(0.5);
    this.vel.add(force);
    this.thrust();
  };

  this.inc = [];
  this.inc.push("");

  this.hits = function(inc) {
    var d = dist(this.pos.x, this.pos.y, inc.pos.x, inc.pos.y);
    if (d < this.r + inc.r) {
      return true;
    }
  };

  this.setRotation = function(a) {
    this.rotation = a;
  };

  this.turn = function() {
    this.heading += this.rotation;
  };

  this.shiphits = function(spec) {
    for (var s = ship.length - 1; s >= 0; s--) {
      for (var j = asteroids.length - 1; j >= 0; j--) {
        if (ship[0].hits(asteroids[j])) {
          var newParts = asteroids[j].pts();
          parts = parts.concat(newParts);

          bl.play();
          score += -10;
          damg += 2*this.r;

          if (asteroids[j].r > 10) {
            var newAsteroids = asteroids[j].breakup();
            asteroids = asteroids.concat(newAsteroids);
          }
          this.setRotation(random(-0.2, 0.2));
          asteroids.splice(j, 1);
          if (damg >= 255) {
            ship.splice(0, 1);
            damg = 0;
          }  
          break;
        }
      }
    }
  };
  // var level = []
  // level[3]= function ()
  // {
  //         for (var j = asteroids.length - 1; j >= 0; j--) {
  //             if (ship[0].hits(asteroids[j])) {
  //                 bl.play();
  //                score += -10;
  //                 if (asteroids[j].r > 10) {

  //                     var newAsteroids = asteroids[j].breakup();
  //                     asteroids = asteroids.concat(newAsteroids);
  //                 }
  //                 this.setRotation(random(-0.2, 0.2));
  //                 asteroids.splice(j, 1);

  //                 //ship.splice(0, 1);
  //                 break;
  //             }

  //         }

  //level [2]
  // this.Level = function ()
  // {

  // var ob = function (l, s, as)
  // {
  //     for (var as = asteroids.length - 1; as >= 0; as--) {
  //         for (var s = ship.length - 1; s >= 0; s--) {

  //             if (lasers[l].hits(asteroids[as])) {
  //                 score += 10;
  //                 bl.play();
  //             }
  //             if (ship[s].hits(asteroids[as])) {

  //                 bl.play();
  //                 background(125);
  //                 score += -30;
  //                 { //if (forceField){
  //                     //hitValue=damageValue;
  //                     //damageValue.push(hitValue);
  //                     //}
  //                     //this is the shipLeveling block
  //                     // this.setRotation(random(-0.2,0.2));
  //                 }
  //             }
  //             if (asteroids[as].r > 10) {

  //                 var newAsteroids = asteroids[j].breakup();
  //                 asteroids = asteroids.concat(newAsteroids);
  //             }

  //             lasers.splice(0, 1);
  //             asteroids.splice(0, 1);
  //             ship.splice(0, 1);
  //             break;
  //             return
  //             ////
  //         }
  //     }
  //};
  this.move = function() {
    if (keyIsDown((keyCode = 37))) {
      ship[0].setRotation(-0.1);
    }
    if (keyIsDown((keyCode = 39))) {
      ship[0].setRotation(0.1);
    }
    if (keyIsDown((keyCode = 38))) {
      ship[0].boosting(true);
    }

    keyReleased = function(keyCode = 37 || 38) {
      ship[0].setRotation(false);
      ship[0].boosting(false);
    };

    keyPressed = function(e) {
      if (e.keyCode == 32) {
        lasers.push(new Laser(ship[0].pos, ship[0].heading));
        fire.play();
      }
    };
  };
}
