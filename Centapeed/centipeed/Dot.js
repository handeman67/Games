class Dot {
  constructor(x, y, SIZE, sp, isHead = true, segmentIndex = 0) {
    if(!x)x=0;
    if(!y)y=0;
    this.pos = createVector(x, y);
    this.x=this.pos.x;
    this.y=this.pos.y;
    this.SIZE = SIZE;
    this.num = 1;
    this.sp = sp;
    this.color = color(random(255), random(255), random(255));
    this.hit = false;
    this.isDestroyed = false;
    this.particles = [];
    
    // Centipede chain properties
    this.isHead = isHead;
    this.segmentIndex = segmentIndex;
    this.nextSegment = null; // Reference to next segment in chain
    this.prevSegment = null; // Reference to previous segment
    
    // Stuck detection for eating mushrooms
    this.stuckCounter = 0;
    this.lastPos = createVector(x, y);
    this.isStuck = false;
    this.eatingMushroom = null;
    this.eatProgress = 0;
    
    // Get appropriate image for this segment
    this.getSegmentImage = () => {
      if (this.isHead) {
        return Grr; // Head - angry face
      } else {
        // Body segments - cycle through different faces
        let bodyImages = [satisfied, flustered, blush, big, sleep];
        return bodyImages[this.segmentIndex % bodyImages.length];
      }
    };
    
    // Choose image based on segment type
    this.segmentImage = this.getSegmentImage();
    
    this.show = () => {
      if (this.isDestroyed) {
        // Only show particles if destroyed
        this.showParticles();
        return;
      }
      
      push();
      stroke(0, 100, 0);
      strokeWeight(0.005);
      fill('#ffffff55');
      image(this.segmentImage, this.pos.x, this.pos.y, SIZE, SIZE);
      pop();
      
      // Show particles even when alive (for hit effects)
      this.showParticles();
    };
    
    ///hit detection
    this.inc = [];
    this.inc.push("");
    this.hits = (inc) => {
      if (this.isDestroyed) return false;
      
      var d = dist(this.pos.x + this.SIZE / 2, this.pos.y + this.SIZE / 2, 
                   inc.pos.x, inc.pos.y);
      if (d < this.SIZE / 2 + (inc.SIZE || 5)) {
        this.hit = true;
        return true;
      } else {
        this.hit = false;
        return false;
      }
    };
    
    // Explode with green particles
    this.explode = () => {
      this.isDestroyed = true;
      
      // Create 20-30 green particles
      let particleCount = floor(random(20, 30));
      
      for (let i = 0; i < particleCount; i++) {
        let angle = random(TWO_PI);
        let speed = random(3, 8);
        
        // Green color variations
        let greenShade = floor(random(3));
        let col;
        switch(greenShade) {
          case 0: col = color(0, 255, 100); break;  // Bright green
          case 1: col = color(50, 200, 50); break;  // Medium green
          case 2: col = color(100, 255, 150); break; // Light green
        }
        
        this.particles.push({
          x: this.pos.x + this.SIZE / 2,
          y: this.pos.y + this.SIZE / 2,
          vx: cos(angle) * speed,
          vy: sin(angle) * speed - random(1, 3),
          life: 255,
          size: random(3, 6),
          color: col
        });
      }
    };
    
    // Update particles
    this.updateParticles = () => {
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
    };
    
    // Show particles
    this.showParticles = () => {
      push();
      noStroke();
      
      for (let p of this.particles) {
        fill(red(p.color), green(p.color), blue(p.color), p.life);
        ellipse(p.x, p.y, p.size);
        
        // Glow effect
        fill(red(p.color), green(p.color), blue(p.color), p.life * 0.3);
        ellipse(p.x, p.y, p.size * 1.5);
      }
      
      pop();
    };
    
    // Check if should be removed
    this.shouldRemove = () => {
      return this.isDestroyed && this.particles.length === 0;
    };

    ///
    this.move = () => {
      if (this.isDestroyed) {
        this.updateParticles();
        return;
      }
      
      // Store previous position for following segments
      let prevX = this.pos.x;
      let prevY = this.pos.y;
      
      // Only head moves independently
      if (this.isHead) {
        // Check if trapped before moving
        if (this.isTrapped()) {
          this.isStuck = true;
          this.tryEatMushroom();
          this.updateParticles();
          return;
        }
        
        // Check if stuck (not moving much)
        let distMoved = dist(this.pos.x, this.pos.y, this.lastPos.x, this.lastPos.y);
        
        if (distMoved < 0.5) {
          this.stuckCounter++;
          if (this.stuckCounter > 20) { // Stuck for 20 frames
            this.isStuck = true;
            this.tryEatMushroom();
          }
        } else {
          this.stuckCounter = 0;
          this.isStuck = false;
          this.eatingMushroom = null;
          this.eatProgress = 0;
        }
        
        this.lastPos.set(this.pos.x, this.pos.y);
        
        // Normal movement
        this.pos.x += this.sp;
        if (this.pos.x < 0 || this.pos.x > width - SIZE) {
          this.drop();
        }
        if (this.pos.y < 0 || this.pos.y > height - SIZE) {
          this.pos.x = 0;
          this.pos.y = 0;
        }
      } else if (this.prevSegment && !this.prevSegment.isDestroyed) {
        // Body segments follow the previous segment with slight delay
        let targetX = this.prevSegment.pos.x;
        let targetY = this.prevSegment.pos.y;
        
        // Calculate distance to previous segment
        let distToPrev = dist(this.pos.x, this.pos.y, targetX, targetY);
        let idealDistance = SIZE * 0.8; // Ideal spacing between segments
        
        // Adjust follow speed based on distance
        let followSpeed;
        if (distToPrev < idealDistance * 0.5) {
          // Too close - slow down significantly to stretch out
          followSpeed = 0.1;
        } else if (distToPrev < idealDistance) {
          // Slightly close - slow down a bit
          followSpeed = 0.2;
        } else if (distToPrev > idealDistance * 1.5) {
          // Too far - speed up to catch up
          followSpeed = 0.5;
        } else {
          // Normal distance - normal speed
          followSpeed = 0.3;
        }
        
        // Smooth following with adaptive interpolation
        this.pos.x = lerp(this.pos.x, targetX, followSpeed);
        this.pos.y = lerp(this.pos.y, targetY, followSpeed);
      }
      
      // Update particles
      this.updateParticles();
    };
    
    // Check if centipede is trapped by mushrooms (all 5 squares blocked)
    this.isTrapped = () => {
      if (!this.isHead || typeof spatialGrid === 'undefined') return false;
      
      // Check all 5 surrounding squares (excluding up since no up movement)
      let checkPositions = [
        { x: this.pos.x + SIZE, y: this.pos.y },           // Right
        { x: this.pos.x - SIZE, y: this.pos.y },           // Left
        { x: this.pos.x, y: this.pos.y + SIZE },           // Down
        { x: this.pos.x + SIZE, y: this.pos.y + SIZE },    // Down-Right
        { x: this.pos.x - SIZE, y: this.pos.y + SIZE }     // Down-Left
      ];
      
      let blockedCount = 0;
      
      for (let checkPos of checkPositions) {
        // Check if position is out of bounds (counts as blocked)
        if (checkPos.x < 0 || checkPos.x >= width || checkPos.y >= height) {
          blockedCount++;
          continue;
        }
        
        let isBlocked = false;
        let nearbyTiles = spatialGrid.getNearbyTiles(checkPos.x, checkPos.y);
        
        for (let tile of nearbyTiles) {
          if (!tile) continue;
          
          if ((tile.type === 1 || tile.type === 5 || tile.type === 6) && 
              tile.mushroom && !tile.mushroom.isDestroyed) {
            
            let mushroomCenterX = tile.x * SIZE + SIZE / 2;
            let mushroomCenterY = tile.y * SIZE + SIZE / 2;
            let d = dist(checkPos.x + SIZE / 2, checkPos.y + SIZE / 2, mushroomCenterX, mushroomCenterY);
            
            if (d < SIZE) {
              isBlocked = true;
              break;
            }
          }
        }
        
        if (isBlocked) {
          blockedCount++;
        }
      }
      
      // Only trapped if ALL 5 squares are blocked
      return blockedCount >= 5;
    };
    
    // Try to eat mushroom when stuck
    this.tryEatMushroom = () => {
      if (!this.isHead || !this.isStuck) return;
      
      // If already eating a mushroom, continue eating it
      if (this.eatingMushroom && this.eatingMushroom.mushroom && !this.eatingMushroom.mushroom.isDestroyed) {
        this.eatMushroom(this.eatingMushroom);
        return;
      }
      
      // Find closest mushroom to eat
      let closestMushroom = null;
      let closestDist = SIZE * 1.5;
      
      // Get nearby tiles
      if (typeof spatialGrid !== 'undefined') {
        let nearbyTiles = spatialGrid.getNearbyTiles(this.pos.x, this.pos.y);
        
        for (let tile of nearbyTiles) {
          if (!tile) continue;
          
          // Check if it's a mushroom
          if ((tile.type === 1 || tile.type === 5 || tile.type === 6) && 
              tile.mushroom && !tile.mushroom.isDestroyed) {
            
            let mushroomCenterX = tile.x * SIZE + SIZE / 2;
            let mushroomCenterY = tile.y * SIZE + SIZE / 2;
            let d = dist(this.pos.x + SIZE / 2, this.pos.y + SIZE / 2, mushroomCenterX, mushroomCenterY);
            
            if (d < closestDist) {
              closestDist = d;
              closestMushroom = tile;
            }
          }
        }
        
        if (closestMushroom) {
          this.eatingMushroom = closestMushroom;
          this.eatMushroom(closestMushroom);
        } else {
          // No mushroom found nearby - force unstuck
          console.log("Centipede stuck but no mushroom to eat - forcing drop");
          this.isStuck = false;
          this.stuckCounter = 0;
          this.drop();
        }
      }
    };
    
    // Eat through mushroom and grow
    this.eatMushroom = (tile) => {
      if (!tile || !tile.mushroom || tile.mushroom.isDestroyed) {
        this.isStuck = false;
        this.stuckCounter = 0;
        this.eatingMushroom = null;
        this.eatProgress = 0;
        return;
      }
      
      this.eatProgress++;
      
      // Damage mushroom while eating (faster than shooting)
      if (this.eatProgress % 5 === 0) {
        tile.takeDamage(20);
      }
      
      // If mushroom is destroyed, grow and continue
      if (tile.mushroom.isDestroyed) {
        this.growSegment();
        this.isStuck = false;
        this.stuckCounter = 0;
        this.eatingMushroom = null;
        this.eatProgress = 0;
        
        // Force drop to continue movement
        this.drop();
      }
    };
    
    // Add a new segment to the tail
    this.growSegment = () => {
      // Find the tail of this centipede
      let tail = this;
      while (tail.nextSegment && !tail.nextSegment.isDestroyed) {
        tail = tail.nextSegment;
      }
      
      // Create new segment at tail position
      let newSegment = new Dot(
        tail.pos.x - this.sp * SIZE * 0.8,
        tail.pos.y,
        SIZE,
        this.sp,
        false,
        tail.segmentIndex + 1
      );
      
      // Link to chain
      tail.nextSegment = newSegment;
      newSegment.prevSegment = tail;
      
      // Add to global dot array
      if (typeof dot !== 'undefined') {
        dot.push(newSegment);
      }
    };

    this.drop = () => {
      // Only head can drop (body follows)
      if (this.isHead) {
        this.pos.y = SIZE + this.pos.y;
        this.sp = -this.sp;
        if (this.pos.y > h) {
          if (this.dt >= dot.length) {
            level++;
            this.sp++;
            this.pos.y = 100;
            this.pos.x = width / 2;
          }
        }
      }
    };
    
    // Destroy this segment and convert following segments to independent centipedes
    this.destroySegment = () => {
      this.explode();
      
      // If this segment has a next segment, make it a new head
      if (this.nextSegment && !this.nextSegment.isDestroyed) {
        this.nextSegment.becomeHead();
        this.nextSegment.prevSegment = null;
      }
      
      // Disconnect from chain
      if (this.prevSegment) {
        this.prevSegment.nextSegment = null;
      }
    };
    
    // Convert body segment to head
    this.becomeHead = () => {
      this.isHead = true;
      this.segmentImage = Grr; // Change to head image
      this.sp = this.sp || 1.5; // Ensure it has speed
    };
  }
}
