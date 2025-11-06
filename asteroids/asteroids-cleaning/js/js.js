/**
 * Main game file - handles setup, draw loop, and core game logic
 * Coordinates all game systems and manages the main game loop
 */

// Global controls instance
const c = new Controls();



/**
 * p5.js setup function - initializes the game canvas and systems
 */
function setup() {
  let cans;
  cans = createCanvas(innerWidth - 30, innerHeight - 30, P2D);
  cans.parent("agame");
  new resetGame();
  c.createHeader(); // Create the transparent header with buttons and HUD
  playBeat(2500, G.thruster);
  // Stat() will be called when the Stats button is clicked
}

/**
 * p5.js draw function - main game loop called every frame
 */
function draw() {
  background(G.bkg);
  turning();
  moving();
  shipDamage(225);

  // Draw the transparent header with buttons and HUD (only once per frame)
  c.displayHUD();

  drawShip();
  drawAsteroid();

  // Render particles for explosions
  drawParts();

  // Update performance stats
  if (window.stats) {
    window.stats.update();
  }
}

/**
 * Render and update all active particles
 */
function drawParts() {
  for (let p = G.parts.length - 1; p >= 0; p--) {
    let P = G.parts[p];
    P.show();
    P.update();

    // Remove inactive particles from active array
    if (!P.active) {
      G.parts.splice(p, 1);
    }
  }
}

/**
 * Handle key release events for ship controls
 */
function keyReleased() {
  if (keyCode == 37 || keyCode == 39 || keyCode == 38) {
    if (!G.ship[0]) {
      return;
    } else {
      G.ship[0].boosting(false);
    }
  }
}

/**
 * Handle key press events for ship controls
 */
function keyPressed() {
  if (keyCode == 32) { // Spacebar for shooting
    if (G.ship[0]) {
      G.lasers.push(new Laser(G.ship[0].pos, G.ship[0].heading));
      G.fire.play();
    }
  }
}

/**
 * Handle window resize events
 */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
