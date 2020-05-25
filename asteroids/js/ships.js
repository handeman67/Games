
function Ship() {
  let e=this;
  e.pos = createVector(width / 2, height / 2);
  e.r = 10;
  e.heading = 0;
  e.rotation = 0;
  e.vel = createVector(0, 0);
  e.isBoosting = false;
  e.damg = 0;
  Setting();
  function Setting() {
    Boosting();
    Render();
    Update();
    Thrust();
    Edges();
    Boost();
    e.inc = [];
    e.inc.push("");
    Hit();
    Setrotation();
    Turn();
    Shiphit();
    Move();
    Shield()
  }
 function Move() {
    e.move = () => {
      if (keyIsDown((keyCode = 37))) {
        ship[0].setRotation(-0.07);
      }
      if (keyIsDown((keyCode = 39))) {
        ship[0].setRotation(0.07);
      }
      if (keyIsDown((keyCode = 38))) {
        ship[0].boosting(true);
      }
      keyReleased = (keyCode = 37 || 38) => {
        ship[0].setRotation(false);
        ship[0].boosting(false);
      };
      keyPressed = (e) => {
        if (e.keyCode == 32) {
          lasers.push(new Laser(ship[0].pos, ship[0].heading));
          fire.play();
        }
        if(e.keyCode==83){
          ship[0].shield(true)
        }
      };
    };
  }

  function Update() {
    e.update = () => {
      if (e.isBoosting) {
        e.boost();
      }
      e.pos.add(e.vel);
      e.vel.mult(0.98);
    };
  }
function Shield(){
  e.shield=()=>{
    console.log("shield is on")
  }
}
  function Shiphit() {
    e.shiphits = () => {
      for (var s = ship.length - 1; s >= 0; s--) {
        for (var j = asteroids.length - 1; j >= 0; j--) {
          if (ship[0].hits(asteroids[j])) {
            var newParts = asteroids[j].pts();
            parts = parts.concat(newParts);
            bl.play();
            score += -10;
            damg += 2 * e.r;
            if (asteroids[j].r > 10) {
              var newAsteroids = asteroids[j].breakup();
              asteroids = asteroids.concat(newAsteroids);
            }
            e.setRotation(random(-0.2, 0.2));
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
  }

  function Turn() {
    e.turn = function () {
      e.heading += e.rotation;
    };
  }

  function Setrotation() {
    e.setRotation = (a) => {
      e.rotation = a;
    };
  }

  function Hit() {
    e.hits = (inc) => {
      var d = dist(e.pos.x, e.pos.y, inc.pos.x, inc.pos.y);
      if (d < e.r + inc.r) {
        return true;
      }
    };
  }

  function Boost() {
    e.boost = () => {
      var force = p5.Vector.fromAngle(e.heading);
      force.mult(0.5);
      e.vel.add(force);
      e.thrust();
    };
  }

  function Edges() {
    e.edges = () => {
      if (e.pos.x > width + e.r) {
        e.pos.x = -e.r;
      }
      else if (e.pos.x < -e.r) {
        e.pos.x = width + e.r;
      }
      if (e.pos.y > height + e.r) {
        e.pos.y = -e.r;
      }
      else if (e.pos.y < -e.r) {
        e.pos.y = height + e.r;
      }
    };
  }

  function Thrust() {
    e.thrust = () => {
      e.v = 255;
      e.v1 = 0;
      e.v2 = random(255);
      //e.vv =
      push();
      translate(e.pos.x, e.pos.y);
      rotate(e.heading + PI / 2);
      stroke(e.v, e.v - 50, e.v2, e.v);
      strokeWeight(random(2));
      fill(e.v, e.v, e.v1 + e.v2, e.v2);
      beginShape();
      triangle(-e.r + 2, e.r - 2, e.r - 2, e.r - 2, 0, -e.r + random(20, 40));
      endShape();
      pop();
      thrust.play();
    };
  }

  function Render() {
    e.render = () => {
      let red = 255;
      let green = 255 - damg;
      let blue = 255 - damg;
      push();
      translate(e.pos.x, e.pos.y);
      rotate(e.heading + PI / 2);
      Shipframe(red,green,blue);      
      pop();
    };
    function Shipframe(red,green,blue) {
      e.shipFrame =stroke(255, 255, blue);
      fill(red, green, blue);
      triangle(-e.r, e.r, e.r, e.r, 0, -e.r);
      noStroke();
      fill(0);
      triangle(-e.r + 4, e.r - 4, e.r - 4, e.r - 5, 0, -e.r + 20);
    }
  }

   function Boosting() {
    e.boosting = (b) => {
      e.isBoosting = b;
    };
  }
}
