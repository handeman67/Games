/**
 * Ship explosion effects - creates particle explosions when ship is destroyed
 * Integrates with the particle system for visual feedback
 */

/**
 * Create explosion particles at ship position when destroyed
 * @param {p5.Vector} pos - Position where ship was destroyed
 */
function createShipExplosion(pos) {
  if (!G.parts || !Array.isArray(G.parts)) G.parts = [];

  // Create large explosion particles for ship destruction
  let explosionParticleCount = Math.max(15, Math.min(30, Math.floor(width / 20))); // Scale with screen size

  for (let i = 0; i < explosionParticleCount; i++) {
    let particle = G.getInactiveParticle ? G.getInactiveParticle() : new Particles();
    if (particle) {
      particle.active = true;
      particle.pos = createVector(pos.x, pos.y);
      particle.r = random(8, 20); // Larger particles for ship explosion
      particle.alpha = 255;
      particle.lifespan = 255; // Full lifespan for dramatic effect

      // Random explosion velocity - more spread out than asteroid particles
      let angle = random(TWO_PI);
      let speed = random(2, 8);
      particle.vel = createVector(cos(angle) * speed, sin(angle) * speed);

      // Ship explosion colors - mix of red, orange, yellow
      let explosionColors = [
        color(255, 100, 0),    // Orange
        color(255, 200, 0),    // Yellow
        color(255, 50, 50),    // Red
        color(255, 150, 0),    // Orange-red
        color(255, 255, 100)   // Light yellow
      ];
      particle.col = random(explosionColors);

      G.parts.push(particle);
    }
  }

  // Add some smaller debris particles for realism
  let debrisCount = Math.max(5, Math.min(15, Math.floor(width / 40)));
  for (let i = 0; i < debrisCount; i++) {
    let particle = G.getInactiveParticle ? G.getInactiveParticle() : new Particles();
    if (particle) {
      particle.active = true;
      particle.pos = createVector(pos.x + random(-10, 10), pos.y + random(-10, 10));
      particle.r = random(2, 6); // Smaller debris
      particle.alpha = 255;
      particle.lifespan = 180; // Shorter lifespan for debris

      // Debris moves slower and more randomly
      let angle = random(TWO_PI);
      let speed = random(1, 4);
      particle.vel = createVector(cos(angle) * speed, sin(angle) * speed);

      // Debris colors - metallic grays and silvers
      particle.col = color(random(150, 200), random(150, 200), random(150, 200));

      G.parts.push(particle);
    }
  }
}
