class Laser {
  constructor(spos, angle, SIZE) {
    this.hit = false;
    this.sp = 5;
    this.angle = angle || 0;
    this.heading = 180;
    this.SIZE = SIZE || 2;
    this.pos = createVector(spos.x, spos.y - 10);
    this.vel = p5.Vector.fromAngle(this.heading);
    this.vel.mult(0.9);
  }
  
  /**
   * Update laser position
   */
  update() {
    this.pos.add(this.vel);
  }

  /**
   * Display the laser
   */
  show() {
    push();
    stroke(255, 255, 100);
    strokeWeight(this.SIZE * 2);
    fill(100, 255, 200);
    point(this.pos.x, this.pos.y);
    
    // Add glow effect
    stroke(255, 255, 100, 100);
    strokeWeight(this.SIZE * 4);
    point(this.pos.x, this.pos.y);
    pop();
  }
  
  /**
   * Check collision with an object
   */
  hits(target) {
    if (!target || !target.pos) return false;
    
    // Calculate distance between laser and target
    let targetSize = target.SIZE || target.size || 10;
    let d = dist(this.pos.x, this.pos.y, target.pos.x, target.pos.y);
    
    // Check if collision occurred
    if (d < this.SIZE + targetSize / 2) {
      this.hit = true;
      return true;
    }
    
    return false;
  }

  /**
   * Move the laser upward
   */
  move() {
    this.pos.y -= this.sp;
  }
  
  /**
   * Check if laser is off screen
   */
  offScreen() {
    return (this.pos.x < 0 || this.pos.x > width || 
            this.pos.y < 0 || this.pos.y > height);
  }
  
  /**
   * Check if laser should be removed
   */
  shouldRemove() {
    return this.hit || this.offScreen();
  }
}
