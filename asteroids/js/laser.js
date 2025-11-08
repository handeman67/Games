/**
 * Laser class for ship projectiles
 * Handles laser physics, rendering, and collision detection
 */
class Laser {
  constructor(spos, angle, isEnemy = false) {
    this.pos = createVector(spos.x, spos.y);
    this.vel = p5.Vector.fromAngle(angle);
    this.vel.mult(10); // Laser speed
    this.r = 2; // Laser radius for collision detection

    // State flags
    this.contact = false; // Has hit something
    this.active = true; // Is still active in game
    this.isEnemy = isEnemy; // Track if this is an enemy laser
  }

  /**
   * Update laser position and check bounds
   */
  update() {
    if (!this.active) return;

    this.pos.add(this.vel);

    // Check if laser is off-screen
    if (this.offscreen()) {
      this.active = false;
    }
  }

  /**
   * Render the laser as a small white circle
   */
  render() {
    if (!this.active) return;

    push();
    stroke(255);
    strokeWeight(4);
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.r * 2);
    pop();
  }

  /**
   * Check if laser is outside the game bounds
   * @returns {boolean} True if off-screen
   */
  offscreen() {
    return this.pos.x > width + this.r ||
           this.pos.x < -this.r ||
           this.pos.y > height + this.r ||
           this.pos.y < -this.r;
  }

  /**
   * Check collision with another object
   * @param {Object} inc - Object to check collision with
   * @returns {boolean} True if collision detected
   */
  hits(inc) {
    if (!this.active || !inc) return false;

    let d = dist(this.pos.x, this.pos.y, inc.pos.x, inc.pos.y);
    if (d < this.r + inc.r) {
      this.contact = true;
      this.active = false; // Deactivate laser on hit
      return true;
    }
    return false;
  }
}

/**
 * Update and render all active lasers
 * Handles laser lifecycle management
 */
function shoot() {
  for (let l = G.lasers.length - 1; l >= 0; l--) {
    let laser = G.lasers[l];

    // Update laser physics
    laser.update();

    // Render if still active
    if (laser.active) {
      laser.render();
    } else {
      // Remove inactive lasers
      G.lasers.splice(l, 1);
    }
  }
}




