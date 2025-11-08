/**
 * Particle class for explosion and visual effects
 * Uses asteroid-like shapes for particles without inheriting full Asteroid class
 */
class Particles {
  constructor(pos, r, vx = null, vy = null, col = null) {
    // Position and physical properties
    this.pos = pos ? pos.copy() : createVector(random(width), random(height));
    this.r = r || random(1.5, 5); // Size 1.5-5 as requested
    this.alpha = 255; // Transparency for fade-out effect
    this.lifespan = 300; // Longer lifespan to prevent premature disappearance

    // Movement properties - particles should move outward on explosion
    this.vel = createVector(vx || 0, vy || 0);
    this.acc = createVector(0, 0); // No gravity for space particles

    // Visual properties - asteroid-like shape properties
    this.vertices = floor(random(5, 9)); // Similar to asteroids
    this.offset = [];
    for (let i = 0; i < this.vertices; i++) {
      this.offset.push(random(0.5, this.r * 0.25)); // Smaller offsets for particles
    }

    // State
    this.active = true;
    this.relativePos = createVector(0, 0); // For positioning relative to parent asteroid
  }

  /**
   * Update particle physics and lifecycle
   */
  update() {
    // Apply acceleration to velocity
    this.vel.add(this.acc);

    // Update position
    this.pos.add(this.vel);

    // Fade out over time (slower fade)
    this.lifespan -= 2; // Slower fade to prevent quick disappearance
    this.alpha = this.lifespan;

    // Deactivate when faded out
    if (this.lifespan <= 0) {
      this.active = false;
    }
  }

  /**
   * Render the particle using asteroid shape
   */
  show() {
    if (!this.active) return;

    push();
    translate(this.pos.x, this.pos.y);

    // Use asteroid rendering with alpha - match asteroid colors
    let strokeColor = color(255, this.alpha); // White stroke like asteroids
    stroke(strokeColor);
    strokeWeight(1); // Normal stroke weight
    fill(100, 100, 100, this.alpha * 0.5); // Gray fill like asteroids

    beginShape();
    rotate(noise(0.005 * this.r, 0.360 * this.r));

    for (let i = 0; i < this.vertices; i++) {
      let ro = this.r + this.offset[i];
      let angle = map(i, 0.5, this.vertices, 0, TWO_PI);
      let x = ro * cos(angle) - atan(angle);
      let y = ro * sin(angle) - tan(-angle);
      vertex(x, y);
    }
    endShape(CLOSE);

    pop();
  }

  /**
   * Render the particle at relative position (no translation needed)
   */
  showRelative() {
    if (!this.active) return;

    // Use asteroid rendering with alpha - match asteroid colors
    let strokeColor = color(255, this.alpha); // White stroke like asteroids
    stroke(strokeColor);
    strokeWeight(1); // Normal stroke weight
    fill(100, 100, 100, this.alpha * 0.5); // Gray fill like asteroids

    beginShape();
    rotate(noise(0.005 * this.r, 0.360 * this.r));

    for (let i = 0; i < this.vertices; i++) {
      let ro = this.r + this.offset[i];
      let angle = map(i, 0.5, this.vertices, 0, TWO_PI);
      let x = ro * cos(angle) - atan(angle);
      let y = ro * sin(angle) - tan(-angle);
      vertex(x, y);
    }
    endShape(CLOSE);
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
