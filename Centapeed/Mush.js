class Mush {

  constructor(x, y, SIZE, type = 1) {
    this.pos = createVector(x, y);
    this.SIZE = SIZE;
    this.type = type; // 1, 2, or 3 for different mushroom variants
    
    // Health system
    this.health = 100;
    this.maxHealth = 100;
    this.isDestroyed = false;
    
    // Bitmap representation
    this.bitmap = new MushroomBitmap(x, y, SIZE, type);
    
    // Initialize bitmap with appropriate mushroom image
    this.initBitmap();
  }
  
  /**
   * Initialize the bitmap from the loaded mushroom image
   */
  initBitmap() {
    let img;
    switch(this.type) {
      case 1:
        img = mushroom;
        break;
      case 2:
        img = mushroom1;
        break;
      case 3:
        img = mushroom2;
        break;
      default:
        img = mushroom1;
    }
    
    if (img) {
      this.bitmap.initBitmap(img);
    }
  }
  
  /**
   * Take damage from laser hit
   */
  takeDamage(amount = 25) {
    if (this.isDestroyed) return false;
    
    this.health -= amount;
    this.bitmap.takeDamage(amount);
    
    if (this.health <= 0) {
      this.health = 0;
      this.isDestroyed = true;
      return true; // Mushroom destroyed
    }
    
    return false; // Still alive
  }
  
  /**
   * Display the mushroom
   */
  show() {
    if (this.isDestroyed && this.bitmap.shouldRemove()) {
      return; // Don't draw if fully destroyed and particles gone
    }
    
    this.bitmap.draw();
  }
  
  /**
   * Update mushroom state
   */
  update() {
    // Update bitmap (particles and physics)
    if (this.bitmap) {
      this.bitmap.update();
    }
  }
  
  /**
   * Hit detection with incoming object
   */
  hits(inc) {
    if (this.isDestroyed) return false;
    
    var d = dist(this.pos.x + this.SIZE / 2, this.pos.y + this.SIZE / 2, 
                 inc.pos.x, inc.pos.y);
    
    if (d < this.SIZE / 2 + (inc.SIZE || 5)) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Check if mushroom should be removed from array
   */
  shouldRemove() {
    return this.isDestroyed && this.bitmap.shouldRemove();
  }
  
  /**
   * Get health percentage
   */
  getHealthPercent() {
    return this.health / this.maxHealth;
  }
}
