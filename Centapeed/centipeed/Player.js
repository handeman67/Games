class Player {
  constructor(pos, SIZE, spd, a) {

    pos = createVector(0, 0);
    this.pos = pos;
    this.SIZE = SIZE;

    this.heading = 0;
    this.rotation = 0;
    this.spd = spd;
    this.isDestroyed = false;
    this.particles = [];
    this.lives = 3;

    this.move = () => {
      if (keyIsDown(97)) {
        this.setRotation(-1);
      } else if (keyIsDown(98)) {
        this.setRotation(1);
      } else {
        this.setRotation(0);
      }
      if (keyIsDown(37)) {
        this.pos.x -= this.spd;
      }
      if (keyIsDown(39)) {
        this.pos.x += this.spd;
      }
      if (keyIsDown(38)) {
        this.pos.y -= this.spd;
      }
      if (keyIsDown(40)) {
        this.pos.y += this.spd;
      }
      if (keyIsDown(99)) {
        this.heading = 0;
      }

      function keyReleased(keyCode) {
        this.setRotation(0);
        //this.heading=0;
      }

    };


    this.render = () => {
      if (this.isDestroyed) {
        // Show particles if destroyed
        this.showParticles();
        return;
      }
      
      var red = 100;
      var green = 255 - damg;
      var blue = 0 - damg;
      var damg = 50;
      push();
      translate(this.pos.x, this.pos.y);
      rotate(this.heading + PI / 2);
      this.shipFrame = stroke(0, 255, 255);
      fill(red, green, blue);
      triangle(-SIZE, SIZE, SIZE, SIZE, 0, -SIZE - 10);
      pop();
      
      // Show particles even when alive
      this.showParticles();
    };
    
    // Explode with colorful particles
    this.explode = () => {
      this.isDestroyed = true;
      
      // Create 30-40 colorful particles
      let particleCount = floor(random(30, 40));
      
      for (let i = 0; i < particleCount; i++) {
        let angle = random(TWO_PI);
        let speed = random(4, 10);
        
        // Colorful explosion - red, orange, yellow
        let colorChoice = floor(random(4));
        let col;
        switch(colorChoice) {
          case 0: col = color(255, 0, 0); break;     // Red
          case 1: col = color(255, 100, 0); break;   // Orange
          case 2: col = color(255, 200, 0); break;   // Yellow
          case 3: col = color(255, 255, 100); break; // Light yellow
        }
        
        this.particles.push({
          x: this.pos.x,
          y: this.pos.y,
          vx: cos(angle) * speed,
          vy: sin(angle) * speed - random(1, 4),
          life: 255,
          size: random(4, 8),
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
        p.vy += 0.4;
        
        // Fade out
        p.life -= 6;
        
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
        fill(red(p.color), green(p.color), blue(p.color), p.life * 0.4);
        ellipse(p.x, p.y, p.size * 2);
      }
      
      pop();
    };
    
    // Check if explosion animation is complete
    this.shouldRemove = () => {
      return this.isDestroyed && this.particles.length === 0;
    };
    
    // Respawn player
    this.respawn = () => {
      this.isDestroyed = false;
      this.particles = [];
      this.pos.x = width / 2;
      this.pos.y = height - SIZE * 3;
      this.heading = 0;
    };
    this.edges = () => {
      if (this.pos.x > width - SIZE * 2) {
        this.pos.x = width - SIZE * 2;
      } else if (this.pos.x < SIZE * 2 + 5) {
        this.pos.x = SIZE * 2 + 5;
      }
      if (this.pos.y > height - SIZE * 2) {
        this.pos.y = height - SIZE * 2;
      } else if (this.pos.y < height / 1.3) {
        this.pos.y = height / 1.3;
      }
    };
    this.inc = [];
    this.inc.push("");

    this.hits = (inc) => {
      if (this.isDestroyed) return false;
      
      var d = dist(this.pos.x, this.pos.y, inc.pos.x, inc.pos.y);
      
      if (d < SIZE + (inc.SIZE || SIZE)) {
        return true;
      }
      return false;
    };
    this.setRotation = (a) => {
      this.rotation = a;
    };
    this.turn = () => {
      this.heading += this.rotation;
    };
  }
}
