/**
 * MushroomBitmap.js
 * Handles bitmap representation of mushrooms with damage states
 * and pixel-based disintegration effects
 */

class MushroomBitmap {
  constructor(x, y, size, type = 1) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.type = type; // 1, 2, or 3 for different mushroom variants
    this.health = 100;
    this.maxHealth = 100;
    this.isDestroyed = false;
    
    // Damage thresholds for visual states
    this.damageStates = {
      FULL: 100,      // 100% health
      DAMAGED: 75,    // 75% health
      HEAVY: 50,      // 50% health
      CRITICAL: 25    // 25% health
    };
    
    // Bitmap data storage
    this.bitmapData = null;
    this.currentBitmap = null;
    
    // Particle storage for this mushroom
    this.particles = [];
  }
  
  /**
   * Initialize bitmap from the loaded mushroom image
   */
  initBitmap(img) {
    // Create a graphics buffer to extract pixel data
    let pg = createGraphics(this.size, this.size);
    pg.image(img, 0, 0, this.size, this.size);
    pg.loadPixels();
    
    // Store the original pixel data
    this.bitmapData = {
      full: this.copyPixels(pg.pixels),
      width: this.size,
      height: this.size
    };
    
    this.currentBitmap = this.bitmapData.full;
    pg.remove(); // Clean up
  }
  
  /**
   * Copy pixel array
   */
  copyPixels(pixels) {
    let copy = [];
    for (let i = 0; i < pixels.length; i++) {
      copy[i] = pixels[i];
    }
    return copy;
  }
  
  /**
   * Take damage and update visual state
   */
  takeDamage(amount = 25) {
    if (this.isDestroyed) return;
    
    this.health -= amount;
    
    if (this.health <= 0) {
      this.health = 0;
      this.isDestroyed = true;
      this.explode();
    } else {
      // Create particles on hit
      this.createHitParticles(8);
      // Update bitmap to show damage
      this.updateDamagedBitmap();
    }
  }
  
  /**
   * Update bitmap to show progressive damage
   */
  updateDamagedBitmap() {
    if (!this.bitmapData) return;
    
    let damagePercent = this.health / this.maxHealth;
    let newPixels = this.copyPixels(this.bitmapData.full);
    
    // Apply damage effect - remove random pixels based on damage
    let pixelsToRemove = Math.floor((1 - damagePercent) * (newPixels.length / 4) * 0.3);
    
    for (let i = 0; i < pixelsToRemove; i++) {
      let randomIndex = Math.floor(Math.random() * (newPixels.length / 4)) * 4;
      
      // Make pixel transparent or darker
      if (newPixels[randomIndex + 3] > 0) { // If pixel has alpha
        if (Math.random() > 0.5) {
          // Make transparent
          newPixels[randomIndex + 3] = 0;
        } else {
          // Make darker
          newPixels[randomIndex] *= 0.5;     // R
          newPixels[randomIndex + 1] *= 0.5; // G
          newPixels[randomIndex + 2] *= 0.5; // B
        }
      }
    }
    
    this.currentBitmap = newPixels;
  }
  
  /**
   * Create particles when hit
   */
  createHitParticles(count) {
    if (!this.bitmapData) return;
    
    // Sample colors from the mushroom bitmap
    let colors = this.sampleColors(count);
    
    for (let i = 0; i < count; i++) {
      let angle = random(TWO_PI);
      let speed = random(2, 5);
      let col = colors[i % colors.length];
      
      this.particles.push({
        x: this.x + this.size / 2,
        y: this.y + this.size / 2,
        vx: cos(angle) * speed,
        vy: sin(angle) * speed - random(1, 3), // Upward bias
        life: 255,
        size: random(2, 4),
        color: col
      });
    }
  }
  
  /**
   * Create explosion particles when destroyed
   */
  explode() {
    if (!this.bitmapData) return;
    
    // Create more particles for explosion
    let colors = this.sampleColors(20);
    
    for (let i = 0; i < 15; i++) {
      let angle = random(TWO_PI);
      let speed = random(3, 7);
      let col = colors[i % colors.length];
      
      this.particles.push({
        x: this.x + this.size / 2,
        y: this.y + this.size / 2,
        vx: cos(angle) * speed,
        vy: sin(angle) * speed - random(2, 4),
        life: 255,
        size: random(3, 6),
        color: col
      });
    }
  }
  
  /**
   * Sample colors from the mushroom bitmap
   */
  sampleColors(count) {
    let colors = [];
    if (!this.bitmapData) {
      // Default colors if no bitmap
      return [color(200, 100, 100), color(255, 150, 150), color(180, 80, 80)];
    }
    
    let pixels = this.bitmapData.full;
    let attempts = 0;
    
    while (colors.length < count && attempts < count * 10) {
      let index = Math.floor(Math.random() * (pixels.length / 4)) * 4;
      
      // Only sample non-transparent pixels
      if (pixels[index + 3] > 100) {
        colors.push(color(
          pixels[index],
          pixels[index + 1],
          pixels[index + 2]
        ));
      }
      attempts++;
    }
    
    // Fallback colors
    if (colors.length === 0) {
      colors = [color(200, 100, 100), color(255, 150, 150), color(180, 80, 80)];
    }
    
    return colors;
  }
  
  /**
   * Update particles
   */
  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];
      
      // Update position
      p.x += p.vx;
      p.y += p.vy;
      
      // Apply gravity
      p.vy += 0.3;
      
      // Fade out
      p.life -= 5;
      
      // Remove dead particles
      if (p.life <= 0 || p.y > height) {
        this.particles.splice(i, 1);
      }
    }
  }
  
  /**
   * Draw the mushroom with current damage state
   */
  draw() {
    if (this.isDestroyed) {
      // Only draw particles if destroyed
      this.drawParticles();
      return;
    }
    
    // Draw the mushroom bitmap
    if (this.currentBitmap) {
      this.drawBitmap();
    } else {
      // Fallback to simple shape if bitmap not loaded
      push();
      fill(200, 100, 100);
      noStroke();
      ellipse(this.x + this.size / 2, this.y + this.size / 2, this.size * 0.8);
      pop();
    }
    
    // Draw particles
    this.drawParticles();
    
    // Update particles
    this.updateParticles();
  }
  
  /**
   * Draw the bitmap using pixels
   */
  drawBitmap() {
    if (!this.currentBitmap) return;
    
    push();
    // Draw pixel by pixel for damaged effect
    noStroke();
    
    let pixelSize = 1; // Size of each pixel to draw
    
    for (let y = 0; y < this.size; y += pixelSize) {
      for (let x = 0; x < this.size; x += pixelSize) {
        let index = (y * this.size + x) * 4;
        
        let r = this.currentBitmap[index];
        let g = this.currentBitmap[index + 1];
        let b = this.currentBitmap[index + 2];
        let a = this.currentBitmap[index + 3];
        
        if (a > 0) {
          fill(r, g, b, a);
          rect(this.x + x, this.y + y, pixelSize, pixelSize);
        }
      }
    }
    pop();
  }
  
  /**
   * Draw particles
   */
  drawParticles() {
    push();
    noStroke();
    
    for (let p of this.particles) {
      fill(red(p.color), green(p.color), blue(p.color), p.life);
      ellipse(p.x, p.y, p.size);
    }
    
    pop();
  }
  
  /**
   * Check collision with a point
   */
  contains(x, y) {
    return x >= this.x && x <= this.x + this.size &&
           y >= this.y && y <= this.y + this.size;
  }
  
  /**
   * Get health percentage
   */
  getHealthPercent() {
    return this.health / this.maxHealth;
  }
  
  /**
   * Check if mushroom should be removed
   */
  shouldRemove() {
    return this.isDestroyed && this.particles.length === 0;
  }
}
