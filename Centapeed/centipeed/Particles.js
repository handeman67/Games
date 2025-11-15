/**
 * Particles.js
 * Global particle system for managing all particle effects
 */

class ParticleSystem {
  constructor() {
    this.particles = [];
  }
  
  /**
   * Add a particle to the system
   */
  addParticle(x, y, vx, vy, col, size = 3, life = 255) {
    this.particles.push({
      x: x,
      y: y,
      vx: vx,
      vy: vy,
      life: life,
      maxLife: life,
      size: size,
      color: col,
      gravity: 0.3,
      drag: 0.99
    });
  }
  
  /**
   * Create an explosion of particles
   */
  createExplosion(x, y, count, colors, speedMin = 2, speedMax = 6) {
    for (let i = 0; i < count; i++) {
      let angle = random(TWO_PI);
      let speed = random(speedMin, speedMax);
      let col = colors[floor(random(colors.length))];
      
      this.addParticle(
        x,
        y,
        cos(angle) * speed,
        sin(angle) * speed - random(1, 3),
        col,
        random(2, 5),
        random(200, 255)
      );
    }
  }
  
  /**
   * Create a burst of particles (directional)
   */
  createBurst(x, y, count, colors, direction = 0, spread = PI) {
    for (let i = 0; i < count; i++) {
      let angle = direction + random(-spread / 2, spread / 2);
      let speed = random(3, 7);
      let col = colors[floor(random(colors.length))];
      
      this.addParticle(
        x,
        y,
        cos(angle) * speed,
        sin(angle) * speed,
        col,
        random(2, 4),
        random(180, 255)
      );
    }
  }
  
  /**
   * Update all particles
   */
  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];
      
      // Update position
      p.x += p.vx;
      p.y += p.vy;
      
      // Apply physics
      p.vy += p.gravity;
      p.vx *= p.drag;
      p.vy *= p.drag;
      
      // Fade out
      p.life -= 5;
      
      // Remove dead particles or off-screen particles
      if (p.life <= 0 || p.y > height + 50 || p.x < -50 || p.x > width + 50) {
        this.particles.splice(i, 1);
      }
    }
  }
  
  /**
   * Draw all particles
   */
  draw() {
    push();
    noStroke();
    
    for (let p of this.particles) {
      let alpha = map(p.life, 0, p.maxLife, 0, 255);
      fill(red(p.color), green(p.color), blue(p.color), alpha);
      ellipse(p.x, p.y, p.size);
      
      // Optional: add glow effect
      fill(red(p.color), green(p.color), blue(p.color), alpha * 0.3);
      ellipse(p.x, p.y, p.size * 1.5);
    }
    
    pop();
  }
  
  /**
   * Get particle count
   */
  getCount() {
    return this.particles.length;
  }
  
  /**
   * Clear all particles
   */
  clear() {
    this.particles = [];
  }
}

// Global particle system instance
let particleSystem;
