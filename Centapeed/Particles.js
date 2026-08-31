/**
 * Particles.js
 * Global particle system for managing all particle effects
 * 
 * OPTIMIZATION: Object pooling to reduce garbage collection pressure
 * and improve performance during heavy particle effects
 */

class ParticleSystem {
  constructor(poolSize = 1000) {
    this.particles = [];
    this.pool = [];
    this.poolSize = poolSize;
    
    // Pre-allocate particle pool
    this.initializePool();
  }
  
  /**
   * Initialize object pool with reusable particle objects
   * OPTIMIZATION: Pre-allocate particles to avoid allocation during runtime
   */
  initializePool() {
    for (let i = 0; i < this.poolSize; i++) {
      this.pool.push({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        life: 0,
        maxLife: 0,
        size: 0,
        color: null,
        gravity: 0.3,
        drag: 0.99,
        active: false
      });
    }
  }
  
  /**
   * Get a particle from the pool or create a new one
   * OPTIMIZATION: Reuse particles instead of creating new ones
   */
  getParticleFromPool() {
    if (this.pool.length > 0) {
      return this.pool.pop();
    }
    // Fallback: create new if pool is empty
    return {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: 0,
      size: 0,
      color: null,
      gravity: 0.3,
      drag: 0.99,
      active: false
    };
  }
  
  /**
   * Return particle to pool for reuse
   */
  returnParticleToPool(particle) {
    particle.active = false;
    this.pool.push(particle);
  }
  
  /**
   * Add a particle to the system
   * OPTIMIZATION: Uses pooled particles instead of creating new objects
   */
  addParticle(x, y, vx, vy, col, size = 3, life = 255) {
    let p = this.getParticleFromPool();
    p.x = x;
    p.y = y;
    p.vx = vx;
    p.vy = vy;
    p.life = life;
    p.maxLife = life;
    p.size = size;
    p.color = col;
    p.active = true;
    this.particles.push(p);
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
   * OPTIMIZATION: Efficient removal using swap-and-pop, returns to pool
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
        // Return to pool instead of discarding
        this.returnParticleToPool(p);
        // Swap with last and pop (faster than splice)
        this.particles[i] = this.particles[this.particles.length - 1];
        this.particles.pop();
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
