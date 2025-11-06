/**
 * Particle class for explosion and visual effects
 * Handles individual particle physics, rendering, and lifecycle
 */
class Particles {
  constructor(pos, r, vx = null, vy = null, col = null) {
    // Position and physical properties
    this.pos = pos ? pos.copy() : createVector(random(width), random(height));
    this.r = r || random(2, 8);
    this.alpha = 255; // Transparency for fade-out effect
    this.lifespan = 255; // How long particle lives

    // Movement properties
    this.vel = createVector(vx || random(-3, 3), vy || random(-3, 3));
    this.acc = createVector(0, 0.05); // Gravity effect

    // Visual properties
    this.col = col || color(random(100, 255), random(100, 255), random(100, 255));

    // State
    this.active = true;
  }

  /**
   * Update particle physics and lifecycle
   */
  update() {
    // Apply acceleration to velocity
    this.vel.add(this.acc);

    // Update position
    this.pos.add(this.vel);

    // Fade out over time
    this.lifespan -= 4;
    this.alpha = this.lifespan;

    // Deactivate when faded out
    if (this.lifespan <= 0) {
      this.active = false;
    }
  }

  /**
   * Render the particle
   */
  show() {
    if (!this.active) return;

    push();
    // Handle color and alpha properly for p5.js
    if (typeof this.col === 'object' && this.col.levels) {
      // p5.js color object - use RGBA values
      stroke(red(this.col), green(this.col), blue(this.col), this.alpha);
      fill(red(this.col), green(this.col), blue(this.col), this.alpha);
    } else {
      // Fallback for other color types
      stroke(this.col);
      fill(this.col);
    }
    strokeWeight(1);

    // Draw particle as ellipse
    ellipse(this.pos.x, this.pos.y, this.r * 2);

    pop();
  }

  /**
   * Check if particle is off-screen or inactive
   */
  isFinished() {
    return !this.active ||
           this.pos.x < -this.r ||
           this.pos.x > width + this.r ||
           this.pos.y < -this.r ||
           this.pos.y > height + this.r;
  }

  /**
   * Handle screen wrapping for particles (optional)
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
}
