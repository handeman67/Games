/**
 * Ship class - handles both player and enemy ships
 * Manages ship physics, damage, rendering, and AI for enemy ships
 */
class Ships {
  constructor(isEnemy = false, shipType = 0) {
    // Position and physical properties
    this.pos = isEnemy ?
      createVector(random() > 0.5 ? -20 : width + 20, random(height)) :
      createVector(width / 2, height / 2);
    this.r = 10;                    // Ship radius for collision detection
    this.heading = isEnemy ? (this.pos.x < 0 ? 0 : PI) : 0; // Face toward screen for enemies
    this.rotation = 0;              // Current rotation speed
    this.vel = createVector(0, 0);  // Ship velocity vector

    // Ship type and enemy properties
    this.isEnemy = isEnemy;         // Whether this is an enemy ship
    this.shipType = shipType;       // Ship type for different appearances/behavior
    this.damageSystem = true;       // Enable damage system like asteroids

    // Movement state
    this.isBoosting = false;        // Whether ship is currently thrusting
    this.shieldActive = false;      // Whether shield is currently active

    // Damage and visual state
    this.damg = 0;                  // Current damage level (0-255)
    this.maxDamage = 250;           // Maximum damage before destruction
    this.red = 255;                 // Ship color components (damage affects green/blue)
    this.green = 255;
    this.blue = 255;

    // Collision state
    this.contact = false;           // Collision flag

    // Enemy AI properties
    if (isEnemy) {
      this.fireTimer = 0;           // Timer for automatic firing
      this.fireRate = 60;           // Frames between shots (adjustable by level)
      this.accuracy = 0.1;          // Base accuracy (0-1, adjustable by level)
      this.targetPos = createVector(width / 2, height / 2); // Target player position
      this.crossingSpeed = random(1.5, 3.5); // Random initial speed
      this.targetHeading = random(TWO_PI); // Random initial direction
    }

    // Particle accumulation system (like asteroids)
    this.particlePool = [];
    this.numParticles = floor(random(10, 15));
    for (let i = 0; i < this.numParticles; i++) {
      let angle = random(TWO_PI);
      let distance = random(0, this.r * 0.8);
      let relativePos = createVector(cos(angle) * distance, sin(angle) * distance);

      let particle = new Particles(this.pos.copy().add(relativePos), random(1.5, 5));
      particle.initialRelativePos = relativePos.copy();
      particle.relativePos = relativePos.copy();
      particle.active = false;
      particle.vel = createVector(0, 0);
      this.particlePool.push(particle);
    }

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

    // Draw accumulated particles BEFORE the ship shape so they're visible inside
    for (let particle of this.particlePool) {
      if (particle.active) {
        // Draw particle at its relative position within the ship's coordinate space
        push();
        translate(particle.relativePos.x, particle.relativePos.y);
        particle.showRelative();
        pop();
      }
    }

    // Ship outline with damage color
    if (!this.isEnemy) {
      if (G.level.length === 1) {
        // Level 1: Shield always active
        this.shieldActive = true;
        shipDamage(225);
        this.Shield();
      } else if (G.level.length === 2) {
        // Level 2: Shield only active when holding F or 0
        shipDamage(225);
        this.Shield();
      } else {
        // Level 3+: No shield
        shipDamage(25);
      }
    }
    // Use circle as placeholder for enemy ships, image for player
    if (this.isEnemy) {
      // Enemy ship: red circle with damage-based color
      stroke(this.red, this.green - this.damg, this.blue - this.damg);
      strokeWeight(2);
      fill(255, 100, 100, 150); // Reddish fill for enemy
      ellipse(0, 0, this.r * 2);
    } else {
      // Player ship: use image
      image(G.shipimg[0], -this.r * 2, -this.r * 2, this.r * 4, this.r * 4);
      // Ship interior (cockpit)
      noStroke();
      fill(0);
      triangle(-this.r + 4, this.r - 4, this.r - 4, this.r - 5, 0, -this.r + 20);
    }
    pop();
  }

  /**
   * Update ship physics and handle input/AI
   */
  update() {
    if (this.isEnemy) {
      this.updateEnemyAI();
    } else {
      // Check for continuous acceleration while up arrow is held down
      if (keyIsDown(UP_ARROW)) {
        this.boost(0.5);
      }

      // Handle collision resolution
      if (this.contact) {
        resolve_contact();
        this.contact = false;
      }
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

  /**
   * Update enemy AI behavior
   */
  updateEnemyAI() {
    // Random movement pattern - choose random direction and speed
    if (frameCount % 120 === 0) { // Change direction every 2 seconds
      this.targetHeading = random(TWO_PI);
      this.crossingSpeed = random(1.5, 3.5); // Random speed between 1.5 and 3.5
    }

    // Move in the chosen direction
    let moveVec = p5.Vector.fromAngle(this.targetHeading);
    moveVec.mult(this.crossingSpeed);
    this.vel = moveVec;

    // Update target position (player ship)
    let playerShip = G.ship.find(s => !s.isEnemy);
    if (playerShip) {
      this.targetPos = playerShip.pos.copy();
    }

    // Automatic firing
    this.fireTimer++;
    if (this.fireTimer >= this.fireRate) {
      this.fireAtPlayer();
      this.fireTimer = 0;
    }

    // Handle collision resolution for enemies
    if (this.contact) {
      this.contact = false;
      // Enemy ships take damage from collisions
      this.damg += 20;
      this.activateParticlesFromPool();
    }

    // Remove enemy ships that have left the screen completely
    if (this.pos.x < -this.r * 2 || this.pos.x > width + this.r * 2 ||
        this.pos.y < -this.r * 2 || this.pos.y > height + this.r * 2) {
      // Remove enemy ship from array when it leaves the screen
      let enemyIndex = G.ship.findIndex(s => s === this);
      if (enemyIndex !== -1) {
        G.ship.splice(enemyIndex, 1);
      }
    }
  }

  /**
   * Respawn enemy ship on the opposite side of the screen
   */
  respawnEnemy() {
    // Choose a random edge to spawn from
    let edge = floor(random(4)); // 0=top, 1=right, 2=bottom, 3=left

    switch(edge) {
      case 0: // Top
        this.pos = createVector(random(width), -this.r);
        this.targetHeading = random(PI/4, 3*PI/4); // Downward direction
        break;
      case 1: // Right
        this.pos = createVector(width + this.r, random(height));
        this.targetHeading = random(3*PI/4, 5*PI/4); // Leftward direction
        break;
      case 2: // Bottom
        this.pos = createVector(random(width), height + this.r);
        this.targetHeading = random(5*PI/4, 7*PI/4); // Upward direction
        break;
      case 3: // Left
        this.pos = createVector(-this.r, random(height));
        this.targetHeading = random(7*PI/4, 2*PI) + random(-PI/4, PI/4); // Rightward direction
        break;
    }

    // Reset velocity and choose new speed
    this.vel = p5.Vector.fromAngle(this.targetHeading);
    this.crossingSpeed = random(1.5, 3.5);
    this.vel.mult(this.crossingSpeed);

    // Reset damage and contact
    this.damg = 0;
    this.contact = false;
  }

  /**
   * Fire at player with some inaccuracy
   */
  fireAtPlayer() {
    if (!G.ship || !G.ship[0] || G.ship[0].isEnemy) return;

    // Calculate direction to player
    let toPlayer = p5.Vector.sub(this.targetPos, this.pos);
    let distance = toPlayer.mag();

    // Add inaccuracy based on level and distance
    let inaccuracy = (1 - this.accuracy) * distance * 0.1;
    let angleOffset = random(-inaccuracy, inaccuracy);
    toPlayer.rotate(angleOffset);

    // Create laser
    let laserPos = p5.Vector.fromAngle(toPlayer.heading());
    laserPos.mult(this.r + 5);
    laserPos.add(this.pos);

    let enemyLaser = new Laser(laserPos, toPlayer.heading(), true); // isEnemy = true
    enemyLaser.r = 3; // Slightly larger enemy lasers
    G.lasers.push(enemyLaser);

    // Play fire sound
    if (G.fire && G.fire.play) G.fire.play();
  }
  Shield() {
    // Only show shield if active
    if (!this.shieldActive) return;

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

      // Apply damage if this ship has damage system enabled
      if (this.damageSystem) {
        this.damg += inc.r * 25; // Damage based on object size
        this.activateParticlesFromPool();
      }

      return true;
    } else {
      this.contact = false;
      return false;
    }
  }

  /**
   * Activate particles from pool as damage increases (like asteroids)
   */
  activateParticlesFromPool() {
    let damageRatio = this.damg / this.maxDamage;
    let particlesToActivate = floor(damageRatio * this.particlePool.length);

    for (let i = 0; i < particlesToActivate; i++) {
      if (i < this.particlePool.length && !this.particlePool[i].active) {
        // Set the particle's position relative to current ship position
        this.particlePool[i].relativePos = this.particlePool[i].initialRelativePos.copy();
        this.particlePool[i].pos = p5.Vector.add(this.pos, this.particlePool[i].relativePos);
        this.particlePool[i].active = true;
      }
    }
  }

  /**
   * Handle destruction and particle explosion
   */
  destroy() {
    // Explode all particles from pool outward
    for (let particle of this.particlePool) {
      particle.active = true;
      // Set velocity outward from ship center
      let direction = p5.Vector.sub(particle.pos, this.pos).normalize();
      particle.vel = direction.mult(random(2, 5));
      G.parts.push(particle);
    }

    // Clear particle pool
    this.particlePool = [];
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
  // Find the player ship (first non-enemy ship)
  let playerShip = G.ship.find(s => !s.isEnemy);
  if (playerShip && playerShip.damg >= a) {
    // Handle player ship destruction
    playerShip.destroy();
    let playerIndex = G.ship.findIndex(s => !s.isEnemy);
    if (playerIndex !== -1) {
      G.ship.splice(playerIndex, 1);
    }
  }
  return G;
}

// Handle enemy ship damage and destruction
function enemyShipDamage() {
  for (let i = G.ship.length - 1; i >= 0; i--) {
    let ship = G.ship[i];
    if (ship.isEnemy && ship.damg >= ship.maxDamage) {
      // Handle enemy ship destruction
      ship.destroy();
      G.ship.splice(i, 1);
      G.score += 100; // Points for destroying enemy ship (increased from 50)
      if (G.xtraship && G.xtraship.play) G.xtraship.play();
    }
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

      // Find player ship and apply damage
      let playerShip = G.ship.find(s => !s.isEnemy);
      if (playerShip) {
        playerShip.damg += 20;

        // Apply impact force to ship
        let impactDir = p5.Vector.sub(playerShip.pos, a.pos).normalize();
        let impactForce = p5.Vector.mult(impactDir, a.vel.mag() * 0.5 + a.r * 0.1);
        playerShip.vel.add(impactForce);

        // Add spin if asteroid is bigger
        if (a.r > playerShip.r * 2) {
          let spinForce = (a.vel.mag() * 0.01 + a.r * 0.005) * (random() > 0.5 ? 1 : -1);
          playerShip.rotation += spinForce;
        }
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
  // Handle all ships (player and enemies)
  for (let i = G.ship.length - 1; i >= 0; i--) {
    let s = G.ship[i];
    if (s) { // Safety check
      s.render(s.damg);
      s.update();

      // Only apply player-specific logic to player ships
      if (!s.isEnemy) {
        s.turn();
        shoot();
        shipDamage(225);
        //ship[0].defend();
      }
    }
  }

  // Check for enemy ship destruction
  enemyShipDamage();

  // Game over if no player ship
  if (G.ship.length === 0 || !G.ship.some(s => !s.isEnemy)) {
    gameOver();
  }
}
