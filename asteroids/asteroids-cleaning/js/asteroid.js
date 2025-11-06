/**
 * Asteroid class representing space rocks in the game
 * Handles asteroid physics, rendering, damage, and breakup mechanics
 */
class Asteroid {
  constructor(pos, radius, v, isSub = false, parentId = null) {
    let beat = 2000;
    let t = this;
    pos ? t.pos = createVector(pos.x, pos.y) : t.pos = createVector(random(width), random(height));
    radius ? t.r = radius : t.r = random(5, 60);
    t.contact = false;
    t.damg = 0;
    t.maxDamage = Math.max(50, (t.r / 60) * 250); // Minimum 50 damage for small asteroids, 250 for large ones
    t.vel = p5.Vector.random2D();
    t.vel.add(random(-.01, .001) % t.r);
    v ? t.vertices = v : t.vertices = floor(random(7, 10));
    t.inc = [];
    t.inc.push("");
    t.offset = [];
    t.heading = random(TWO_PI);
    t.active = true; // Add active flag for pooling
    t.cracks = []; // Array to hold crack lines
    t.smallPieces = []; // Array to hold small pieces for particle effects
    t.subAsteroids = []; // Array to hold sub-asteroids for breakup
    t.id = random(); // Unique ID for each asteroid
    t.parentId = parentId; // Parent ID to prevent sub-asteroids from same breakup colliding
    t.immunityTimer = 0; // Timer for collision immunity after creation
    t.isSub = isSub; // Flag to identify sub-asteroids
    for (let i = 0; i < t.vertices; i++) {
      t.offset.push(random(2, t.r * 0.25));
    }
    // Create sub-asteroids for breakup only if not a sub-asteroid
    if (!isSub) {
      let numSubs = floor(random(3, 6));
      for (let i = 0; i < numSubs; i++) {
        let angle = random(TWO_PI);
        let dist = random(t.r * 0.2, t.r * 0.6);
        let subPos = createVector(cos(angle) * dist, sin(angle) * dist);
        // Ensure sub-asteroids are always smaller than parent (20-60% of original size)
        let subR = Math.max(5, t.r * random(0.2, 0.6));
        let sub = new Asteroid(subPos, subR, floor(random(5, 8)), true, t.id);
        sub.pos = p5.Vector.add(t.pos, subPos); // Set absolute position
        sub.relativePos = subPos.copy(); // Store relative position for updates
        sub.vel = t.vel.copy(); // Inherit main asteroid's velocity
        sub.active = false;
        t.subAsteroids.push(sub);
      }
    }
  }

  /**
   * Safely play sound effect
   * @param {Object} sound - Sound object to play
   */
  playSound(sound) {
    if (sound && typeof sound.play === 'function') {
      try {
        sound.play();
      } catch (error) {
        console.warn('Failed to play sound:', error);
      }
    }
  }

  update() {
    let t = this;
    t.pos.add(t.vel);
    if (this.contact == true) {
      // console.log("its been hit");
      // G.asteroids.splice(0, 1);
    }
    // Decrement immunity timer
    if (t.immunityTimer > 0) t.immunityTimer--;
  }

  render() {
    let t = this;
    push();
    translate(t.pos.x, t.pos.y);

    // Change stroke color to red as damage increases
    let damageRatio = t.damg / t.maxDamage;
    let strokeColor = lerpColor(color(255), color(255, 0, 0), damageRatio);
    stroke(strokeColor);
    strokeWeight(2);
    fill(100, 100, 100, 125);
    beginShape();
    rotate(noise(0.005 * this.r, 0.360 * this.r));

    for (let i = 0; i < t.vertices; i++) {
      let ro = t.r + t.offset[i];
      let angle = map(i, 0.5, t.vertices, 0, TWO_PI);
      let x = ro * cos(angle) - atan(angle);
      let y = ro * sin(angle) - tan(-angle);
      vertex(x, y);
    }
    endShape(CLOSE);

    // Draw static cracks between vertices when damage > 50%
    if (damageRatio > 0.5) {
      stroke(255, 150);
      noFill();
      strokeWeight(1);
      let numCracks = floor(map(damageRatio, 0.5, 1, 1, t.vertices / 2));
      for (let i = 0; i < numCracks; i++) {
        let startIdx = i * 2;
        let endIdx = (startIdx + 2) % t.vertices;
        let startAngle = map(startIdx, 0, t.vertices, 0, TWO_PI);
        let endAngle = map(endIdx, 0, t.vertices, 0, TWO_PI);
        let startR = t.r + t.offset[startIdx];
        let endR = t.r + t.offset[endIdx];
        let x1 = startR * cos(startAngle) - atan(startAngle);
        let y1 = startR * sin(startAngle) - tan(-startAngle);
        let x2 = endR * cos(endAngle) - atan(endAngle);
        let y2 = endR * sin(endAngle) - tan(-endAngle);
        line(x1, y1, x2, y2);
      }
    }

    // Display damage count for testing (only for damaged asteroids and not too many)
    if (t.damg > 0 && G.asteroids.length < 15) {
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(12);
      text(t.damg, 0, 0);
    }

    pop();
  }
  pts() {
    if (!G.parts || !Array.isArray(G.parts)) G.parts = [];
    // Create small pieces inside the asteroid for buildup effect
    let numPieces = floor(random(3, 8));
    for (let i = 0; i < numPieces; i++) {
      let piece = {
        x: random(-this.r * 0.5, this.r * 0.5),
        y: random(-this.r * 0.5, this.r * 0.5),
        r: random(1, 3)
      };
      this.smallPieces.push(piece);
    }
    // Create particles from the small pieces that accumulated inside
    for (let piece of this.smallPieces) {
      let particle = G.getInactiveParticle ? G.getInactiveParticle() : new Particles();
      if (particle) {
        particle.active = true;
        particle.pos = createVector(this.pos.x + piece.x, this.pos.y + piece.y);
        particle.r = piece.r * 2; // Make particles slightly larger than the small pieces
        particle.alpha = 255;
        particle.vx = random(-2, 2);
        particle.vy = random(-2, 2);
        particle.col = random(255);
        G.parts.push(particle);
      }
    }
    // Also add some additional random particles for explosion effect, more localized
    let extraParticleCount = Math.max(1, Math.min(3, Math.floor(this.r / 10)));
    for (let i = 0; i < extraParticleCount; i++) {
      let particle = G.getInactiveParticle ? G.getInactiveParticle() : new Particles();
      if (particle) {
        particle.active = true;
        // Start particles at the asteroid's center for more localized explosion
        particle.pos = createVector(this.pos.x, this.pos.y);
        particle.r = random(5, 15);
        particle.alpha = 255;
        particle.vx = random(-3, 3);
        particle.vy = random(-3, 3);
        particle.col = random(255);
        G.parts.push(particle);
      }
    }
    return G.parts;
  }
  hits(inc) {
    // Check collision with main asteroid
    let d = dist(this.pos.x, this.pos.y, inc.pos.x, inc.pos.y);
    let hit = false;
    if (d < this.r + inc.r + 5) {
      this.contact = true;
      inc.contact = true;
      hit = true;
    }

    if (hit) {
      // Apply damage based on size of the object hitting (laser r=2, ship r=10)
      this.damg += inc.r * 25; // Proportional damage: lasers do 50, ships do 250
      return true;
    } else {
      this.contact = false;
      return false;
    }
  }

  breakup() {
    // Always create explosion particles
    this.pts();

    // Separate sub-asteroids into individual asteroids
    for (let sub of this.subAsteroids) {
      // Set absolute position based on current parent position
      sub.pos = p5.Vector.add(this.pos, sub.relativePos);
      // Add some random velocity variation plus parent's velocity
      sub.vel = this.vel.copy();
      sub.vel.add(p5.Vector.random2D().mult(random(0.5, 1.5)));
      sub.active = true;
      sub.immunityTimer = 30; // Set immunity timer to prevent immediate collisions
      G.newAsteroids.push(sub); // Add to new asteroids list to avoid processing in current loop
    }

    // Return this asteroid to pool
    this.active = false;
  }

  /**
   * Safely access game arrays with validation
   * @param {Array} arr - Array to access
   * @param {number} index - Index to access
   * @returns {*} Value at index or undefined if invalid
   */
  safeArrayAccess(arr, index) {
    if (Array.isArray(arr) && index >= 0 && index < arr.length) {
      return arr[index];
    }
    return undefined;
  }

  edges() {
    let t = this;

    if (t.pos.x > width + t.r) {
      t.pos.x = -t.r;
    } else if (t.pos.x < -t.r) {
      t.pos.x = width + t.r;
    }
    if (t.pos.y > height + t.r) {
      t.pos.y = -t.r;
    } else if (t.pos.y < -t.r) {
      t.pos.y = height + t.r;
    }
  }
}

function drawAsteroid() {
  const a = G.asteroids,
        lazers = G.lasers,
        sps = G.ship;

  // Initialize new asteroids list if not exists
  if (!G.newAsteroids) G.newAsteroids = [];

  // Check for level progression
  if (a.length <= 0) {
    G.level.push(1);
    let reset = new resetGame(false); // false means it's a level progression, not full reset
  }

  // Limit processing for performance - skip some frames for asteroids when there are many
  let processEveryNth = Math.max(1, Math.floor(a.length / 30)); // Process all when <30 asteroids, every 2nd when 60, etc.

  // Single loop to handle all asteroids - update, render, check collisions
  for (let i = a.length - 1; i >= 0; i--) {
    let ast = a[i];

    // Skip processing some asteroids on busy frames for performance
    if (frameCount % processEveryNth !== 0 && a.length > 20) {
      // Still update position and render, but skip collision checks
      ast.update();
      ast.edges();
      ast.render();
      continue;
    }

    // Update position and handle edges
    ast.update();
    ast.edges();

    // Check collisions with other asteroids
    for (let j = i + 1; j < a.length; j++) {
      let other = a[j];
      if (other && other.active && ast.id !== other.id && ast.parentId !== other.parentId && ast.immunityTimer <= 0 && other.immunityTimer <= 0) {
        let d = dist(ast.pos.x, ast.pos.y, other.pos.x, other.pos.y);
        if (d < ast.r + other.r) {
          // Collision detected, apply damage
          ast.damg += other.r * 10; // Damage based on size
          other.damg += ast.r * 10;

          // Separate asteroids to prevent overlapping
          let overlap = (ast.r + other.r) - d;
          let separation = p5.Vector.sub(ast.pos, other.pos).normalize().mult(overlap / 2);
          ast.pos.add(separation);
          other.pos.sub(separation);

          // Adjust velocities slightly for realism
          let tempVel = ast.vel.copy();
          ast.vel.add(p5.Vector.sub(other.vel, ast.vel).mult(0.1));
          other.vel.add(p5.Vector.sub(tempVel, other.vel).mult(0.1));
        }
      }
    }

    // Check collisions with lasers (limit checks when many asteroids)
    if (lazers && (a.length < 50 || i % 2 === 0)) { // Check every other asteroid when crowded
      lazers.forEach((lsr) => {
        if (lsr && !lsr.contact) {
          ast.hits(lsr);
        }
      });
    }

    // Check collisions with ship
    if (sps && sps[0] && !sps[0].contact) {
      if (ast.hits(sps[0])) {
        // Handle ship damage
        sps[0].damg += 20;
        sps[0].contact = true;
      }
    }

    // Render the asteroid
    ast.render();

    // Handle destruction if damage threshold met
    if (ast.damg >= ast.maxDamage) {
      ast.breakup();
      G.bl.play();
      G.score += 10;
      G.asteroids.splice(i, 1);
      ast.contact = false; // Reset contact after destruction
    } else if (ast.contact) {
      // Reset contact if damage not enough to destroy
      ast.contact = false;
    }
  }

  // Add new asteroids from breakup to the main array
  if (G.newAsteroids.length > 0) {
    G.asteroids.push(...G.newAsteroids);
    G.newAsteroids = [];
  }
}
