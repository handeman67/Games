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

  // Spawn enemy ships based on level
  spawnEnemyShips();

  // Force spawn enemy ships for testing (disabled for level 1 balancing)
  // if (frameCount % 300 === 0 && G.ship && G.ship.some(s => !s.isEnemy)) { // Every 5 seconds
  //   console.log('Force spawning enemy ship for testing');
  //   let enemyShip = new Ships(true, 0);
  //   enemyShip.fireRate = 60;
  //   enemyShip.accuracy = 0.1;
  //   enemyShip.crossingSpeed = 2;
  //   G.ship.push(enemyShip);
  //   console.log(`Force spawned enemy. Total ships: ${G.ship.length}`);
  // }

  // Draw the transparent header with buttons and HUD (only once per frame)
  c.displayHUD();

  drawShip();
  drawAsteroid();

  // Check laser collisions with ships
  checkLaserShipCollisions();

  // Debug: Log laser and ship counts
  if (frameCount % 60 === 0) {
    console.log(`Lasers: ${G.lasers ? G.lasers.length : 0}, Ships: ${G.ship ? G.ship.length : 0}`);
  }

  // Render particles for explosions
  drawParts();

  // Update performance stats
  if (window.stats) {
    window.stats.update();
  }
}

/**
 * Spawn enemy ships based on level and timing
 */
function spawnEnemyShips() {
  // Only spawn if player ship exists
  if (!G.ship || !G.ship.some(s => !s.isEnemy)) return;

  // Calculate spawn parameters based on level
  let currentLevel = G.level.length;
  let enemyCount = G.ship.filter(s => s.isEnemy).length;

  // For level 1, only spawn one enemy at a time and less frequently
  if (currentLevel === 1) {
    if (enemyCount > 0) return; // Don't spawn if there's already an enemy
    let baseSpawnRate = 2400; // Frames between spawns (40 seconds at 60fps for level 1)
    if (frameCount % baseSpawnRate === 0 && random() < 0.5) { // 50% chance when timer hits
      console.log(`Spawning enemy ship at level ${currentLevel}, spawnRate: ${baseSpawnRate}`);
      let enemyShip = new Ships(true, 0); // Create enemy ship
      enemyShip.fireRate = 60;
      enemyShip.accuracy = 0.1;
      enemyShip.crossingSpeed = 1.5;
      G.ship.push(enemyShip);
      console.log(`Enemy ship spawned. Total ships: ${G.ship.length}`);
    }
  } else {
    // For levels > 1, allow multiple enemies with increasing frequency
    let baseSpawnRate = 1200; // Frames between spawns (20 seconds at 60fps)
    let levelMultiplier = max(1, currentLevel * 0.8); // Increase frequency with level
    let spawnRate = baseSpawnRate / levelMultiplier;
    let maxEnemies = min(5, currentLevel); // Cap at 5 enemies max

    if (enemyCount < maxEnemies && frameCount % spawnRate === 0 && random() < 0.3) { // 30% chance when timer hits
      console.log(`Spawning enemy ship at level ${currentLevel}, spawnRate: ${spawnRate}`);
      let enemyShip = new Ships(true, 0); // Create enemy ship

      // Adjust enemy properties based on level
      enemyShip.fireRate = max(30, 60 - currentLevel * 5); // Faster firing with level
      enemyShip.accuracy = min(0.8, 0.1 + currentLevel * 0.1); // More accurate with level
      enemyShip.crossingSpeed = 1.5 + currentLevel * 0.2; // Faster movement with level

      G.ship.push(enemyShip);
      console.log(`Enemy ship spawned. Total ships: ${G.ship.length}`);
    }
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
  if (keyCode == 38) {
    // Up arrow key - stop boosting when released (all levels)
    let playerShip = G.ship.find(s => !s.isEnemy);
    if (playerShip) {
      playerShip.boosting(false);
    }
  } else if (keyCode == 70 || keyCode == 48) {
    // F key or 0 key for shield
    let playerShip = G.ship.find(s => !s.isEnemy);
    if (playerShip) {
      playerShip.shieldActive = false;
    }
  }
}

/**
 * Handle key press events for ship controls
 */
function keyPressed() {
  if (keyCode == 32) { // Spacebar for shooting
    // Find player ship
    let playerShip = G.ship.find(s => !s.isEnemy);
    if (playerShip) {
      let laserPos = p5.Vector.fromAngle(playerShip.heading);
      laserPos.mult(playerShip.r + 10);
      laserPos.add(playerShip.pos);
      G.lasers.push(new Laser(laserPos, playerShip.heading));
      G.fire.play();
    }
  } else if (keyCode == 38) { // Up arrow for acceleration
    // Find player ship
    let playerShip = G.ship.find(s => !s.isEnemy);
    if (playerShip) {
      playerShip.boosting(true);
    }
  } else if (keyCode == 70 || keyCode == 48) { // F key or 0 key for shield (only for level 2)
    let playerShip = G.ship.find(s => !s.isEnemy);
    if (playerShip && G.level.length === 2) {
      playerShip.shieldActive = true;
    }
  }
}

/**
 * Handle key release events for ship controls
 */
function keyReleased() {
  if (keyCode == 70 || keyCode == 48) { // F key or 0 key for shield
    let playerShip = G.ship.find(s => !s.isEnemy);
    if (playerShip) {
      playerShip.shieldActive = false;
    }
  }
}

/**
 * Check collisions between lasers and ships (both player and enemy)
 */
function checkLaserShipCollisions() {
  if (!G.lasers || !G.ship) return;

  for (let i = G.lasers.length - 1; i >= 0; i--) {
    let laser = G.lasers[i];
    if (!laser || laser.contact) continue;

    for (let j = G.ship.length - 1; j >= 0; j--) {
      let ship = G.ship[j];
      if (!ship) continue;

      // Prevent friendly fire - player lasers don't hit player ships, enemy lasers don't hit enemy ships
      if ((laser.isEnemy && ship.isEnemy) || (!laser.isEnemy && !ship.isEnemy)) {
        continue;
      }

      // Debug: Log collision check (only for enemy lasers hitting player ship)
      if (laser.isEnemy && !ship.isEnemy) {
        let d = dist(laser.pos.x, laser.pos.y, ship.pos.x, ship.pos.y);
        let required = laser.r + ship.r;
        console.log(`Enemy laser vs Player: Distance: ${d.toFixed(1)} Required: ${required.toFixed(1)} Hit: ${d < required}`);
      }

      // Check if laser hits this ship
      if (laser.hits(ship)) {
        console.log(`Laser hit! Laser isEnemy: ${laser.isEnemy}, Ship isEnemy: ${ship.isEnemy}, Damage: ${laser.r * 25}`);
        console.log(`Ship before damage: ${ship.damg}/${ship.maxDamage}`);
        // Apply damage to the ship
        ship.damg += laser.r * 25; // Damage based on laser size
        console.log(`Ship after damage: ${ship.damg}/${ship.maxDamage}`);

        // Activate particles from ship's pool
        ship.activateParticlesFromPool();

        // Remove the laser
        G.lasers.splice(i, 1);
        break; // Laser can only hit one ship
      }
    }
  }
}

/**
 * Handle window resize events
 */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
