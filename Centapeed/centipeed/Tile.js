class Tile {
      constructor(x, y, type) {
            if (!x) x = 0;
            if (!y) y = 0;
            this.pos = createVector(x, y);
            this.x = this.pos.x;
            this.y = this.pos.y;
            this.type = type;
            this.hit = false;
            this.SIZE = SIZE;
            
            // For mushroom tiles, create bitmap representation
            this.mushroom = null;
            if (type === 1 || type === 5 || type === 6) {
                  this.initMushroom();
            }
      }
      
      /**
       * Initialize mushroom bitmap for this tile
       */
      initMushroom() {
            let mushroomType = 1;
            if (this.type === 5) mushroomType = 2;
            if (this.type === 6) mushroomType = 3;
            
            this.mushroom = new MushroomBitmap(
                  this.x * SIZE, 
                  this.y * SIZE, 
                  SIZE, 
                  mushroomType
            );
            
            // Immediately initialize with image if available
            if (typeof mushroom !== 'undefined' && mushroom) {
                  let img;
                  switch(this.type) {
                        case 1: img = mushroom; break;
                        case 5: img = mushroom2; break;
                        case 6: img = mushroom2; break;
                        default: img = mushroom;
                  }
                  if (img && img.width > 0) {
                        this.mushroom.initBitmap(img);
                  }
            }
      }
      
      /**
       * Take damage (for mushroom tiles)
       */
      takeDamage(amount = 25) {
            if (this.mushroom && !this.mushroom.isDestroyed) {
                  this.mushroom.takeDamage(amount);
                  
                  if (this.mushroom.isDestroyed) {
                        this.hit = true;
                        return true;
                  }
            }
            return false;
      }
      
      /**
       * Check collision with an object
       */
      hits(inc) {
            if (!inc || !inc.pos) return false;
            
            var s = SIZE;
            var centerX = this.x * s + s / 2;
            var centerY = this.y * s + s / 2;
            var d = dist(centerX, centerY, inc.pos.x, inc.pos.y);
            var incSize = inc.SIZE || inc.size || 5;
            
            if (d < s / 2 + incSize / 2) {
                  return true;
            }
            return false;
      }
      
      /**
       * Draw the tile
       */
      draw() {
            var t = this;
            var s = SIZE;
            
            switch (t.type) {
                  case 0:
                        // Barrier with alien face
                        push();
                        stroke(50, 10);
                        strokeWeight(1);
                        fill(10, 100, 100, 0.5);
                        image(sleep, t.x * s, t.y * s, s, s);
                        pop();
                        break;
                        
                  case 1:
                        // Mushroom type 1 - using bitmap
                        if (t.mushroom) {
                              // Update particles
                              if (t.mushroom.update) {
                                    t.mushroom.update();
                              }
                              t.mushroom.draw();
                        } else {
                              // Fallback
                              push();
                              noFill();
                              image(mushroom, t.x * s, t.y * s, s, s);
                              pop();
                        }
                        break;
                        
                  case 2:
                        // Grass medium
                        push();
                        image(grass1, t.x * s, t.y * s, s, s);
                        pop();
                        break;
                        
                  case 3:
                        // Grass light
                        push();
                        image(grass3, t.x * s, t.y * s, s, s);
                        pop();
                        break;
                        
                  case 4:
                        // Grass dark
                        push();
                        image(grass, t.x * s, t.y * s, s, s);
                        pop();
                        break;
                        
                  case 5:
                        // Mushroom type 2 - using bitmap
                        if (t.mushroom) {
                              // Update particles
                              if (t.mushroom.update) {
                                    t.mushroom.update();
                              }
                              t.mushroom.draw();
                        } else {
                              // Fallback
                              push();
                              image(mushroom2, t.x * s, t.y * s, s, s);
                              pop();
                        }
                        break;
                        
                  case 6:
                        // Mushroom type 3 - using bitmap
                        if (t.mushroom) {
                              // Update particles
                              if (t.mushroom.update) {
                                    t.mushroom.update();
                              }
                              t.mushroom.draw();
                        } else {
                              // Fallback
                              push();
                              image(mushroom2, t.x * s, t.y * s, s, s);
                              pop();
                        }
                        break;
            }
      }
      
      /**
       * Check if tile should be removed (for destroyed mushrooms)
       */
      shouldRemove() {
            if (this.mushroom) {
                  return this.mushroom.shouldRemove();
            }
            return false;
      }
}
