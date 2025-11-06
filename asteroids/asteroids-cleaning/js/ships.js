/**
 * Player ship class - handles player movement, rendering, and collision detection
 * Manages ship physics, damage, and visual effects
 */
class Ships {
  constructor() {
    // Position and physical properties
    this.pos = createVector(width / 2, height / 2);
    this.r = 10;                    // Ship radius for collision detection
    this.heading = 0;               // Ship rotation angle
    this.rotation = 0;              // Current rotation speed
    this.vel = createVector(0, 0);  // Ship velocity vector

    // Movement state
    this.isBoosting = false;        // Whether ship is currently thrusting

    // Damage and visual state
    this.damg = 0;                  // Current damage level (0-255)
    this.red = 255;                 // Ship color components (damage affects green/blue)
    this.green = 255;
    this.blue = 255;

    // Collision state
    this.contact = false;           // Collision flag

    // Game state reference
    this.gs = G.gameStats;
  }

  /**
   * Set boosting state for thrust control
   * @param {boolean} b - Whether ship should boost
   */
  boosting(b) {
    this.isBoosting = b;
  }

  /**
   * Render the ship with damage-based color changes
   * @param {number} damage - Damage level for visual feedback
   */
  render(damage) {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading + PI / 2);

    // Ship outline with damage color
    if (G.level <= 2) { shipDamage(225); this.Shield() } else { shipDamage(25) };
    image(G.shipimg[0], -this.r * 2, -this.r * 2, this.r * 4, this.r * 4);
    // Ship outline with damage color

    // image(imagenes[4], -this.r+6,-this.r+7,this.r*2,this.r*2);
    // image(imagenes[5], -this.r+6,-this.r+7,this.r*2,this.r*2);
    // Ship interior (cockpit)
    noStroke();
    fill(0);
    triangle(-this.r + 4, this.r - 4, this.r - 4, this.r - 5, 0, -this.r + 20);
    pop();
  }

  /**
   * Update ship physics and handle input
   */
  update() {
    // Apply thrust if boosting
    if (this.isBoosting) {
      this.boost(0.5);
    }

    // Handle collision resolution
    if (this.contact) {
      resolve_contact();
      this.contact = false;
    }

    // Update position and apply drag
    this.pos.add(this.vel);
    this.vel.mult(0.98);

    // Handle screen wrapping
    this.edges();

    // Update damage-based colors
    this.green = 255 - this.damg;
    this.blue = 255 - this.damg;
  }
  Shield() {
    // Implement shield functionality here  
    stroke(this.red, this.green, this.blue);
    fill(this.red, this.green, this.blue, 100);
    triangle(-this.r * 2, this.r, this.r * 2, this.r, 0, -this.r * 3);
  }
  /**
   * Render thrust effect when boosting
   */
  thrust() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading + PI / 2);

    // Random thrust flame colors and size
    stroke(255, 205, random(255), 255);
    strokeWeight(random(2));
    fill(255, 255, random(255), random(255));

    beginShape();
    triangle(
      -this.r + 2, this.r - 2,
      this.r - 2, this.r - 2,
      0, -this.r + random(20, 40)
    );
    endShape();
    pop();

    // Play thrust sound
    if (G.thruster && G.thruster.play) G.thruster.play();
  }

  /**
   * Handle screen edge wrapping (toroidal world)
   */
  edges() {
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

  /**
   * Apply thrust force in current heading direction
   * @param {number} a - Thrust acceleration magnitude
   */
  boost(a) {
    let force = p5.Vector.fromAngle(this.heading);
    force.mult(a);
    this.vel.add(force);
    this.thrust();
  }

  /**
   * Check collision with another object
   * @param {Object} inc - Incoming object to check collision with
   * @returns {boolean} - True if collision detected
   */
  hits(inc) {
    let d = dist(this.pos.x, this.pos.y, inc.pos.x, inc.pos.y);
    if (d < this.r + inc.r + 5) {
      this.contact = true;
      inc.contact = true;
      return true;
    } else {
      this.contact = false;
      return false;
    }
  }

  /**
   * Apply rotation to ship heading
   */
  turn() {
    this.heading += this.rotation;
    G.gameStats.headings = this.heading;
  }
}

function shipDamage(a) {
  if (!G.ship || G.ship.length <= 0) {
    return;
  }
  if (G.ship[0]) {
    if (G.ship[0].damg >= a) {
      G.ship.splice(0, 1);
    }
    return G;
  }
}

// function clearShip() {
//   if (!G.ship || G.ship.length <= 0) {
//     return;
//   }
//   if (G.ship[0]) {
//     if (G.ship[0].damg >= 250) {
//       G.ship.splice(0, 1);
//     }
//     return G;
//   }
// }
let cnt = 0;

function resolve_contact() {
  cnt++;
  G.asteroids.forEach((a, index) => {

    if (a.contact) {

      G.bl.play();
      G.score += -10;
      G.ship[0].damg += 20;

      // Apply impact force to ship
      let impactDir = p5.Vector.sub(G.ship[0].pos, a.pos).normalize();
      let impactForce = p5.Vector.mult(impactDir, a.vel.mag() * 0.5 + a.r * 0.1);
      G.ship[0].vel.add(impactForce);

      // Add spin if asteroid is bigger
      if (a.r > G.ship[0].r * 2) {
        let spinForce = (a.vel.mag() * 0.01 + a.r * 0.005) * (random() > 0.5 ? 1 : -1);
        G.ship[0].rotation += spinForce;
      }

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
    s.render(s.damg);
    s.update();
    s.turn();
    shoot();
    shipDamage(225);
    //ship[0].defend();
  } else {
    gameOver();
  }
}
