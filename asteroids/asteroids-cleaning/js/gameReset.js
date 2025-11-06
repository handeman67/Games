// Game configuration and global state management
// Contains all game variables, audio assets, and initialization functions

const Game = {
  // Game statistics and scoring
  "allTime": [0, 0, 0, 0, 0],  // High scores history
  "beat": 4400,                 // Audio beat interval
  "level": [],                  // Current level progression
  "score": 0,                   // Current game score

  // Game object arrays (will be initialized as arrays)
  "ship": [],                   // Player ships
  "asteroids": [],              // Active asteroids
  "parts": [],                  // Active particles
  "lasers": [],
  "shipimg":[],                 // Active laser shots

  // Audio assets (loaded in preload)
  "bl": null,    // Bang Large sound
  "sm": null,    // Bang Small sound
  "bm": null,    // Bang Medium sound
  "bt2": null,   // Beat 2 sound
  "bt1": null,   // Beat 1 sound
  "fire": null,  // Laser fire sound
  "xtraship": null, // Extra ship sound
  "ss": null,    // Saucer Small sound
  "bs": null,    // Saucer Big sound
  "thruster": null, // Ship thruster sound
  "bkg": null,   // Background image

  // Game state management
  "gameStats": {},              // Additional game statistics
  "newAsteroids": [],           // Queue for newly created asteroids
  "offset": [],                 // Asteroid shape offsets

  // Object pools for performance optimization
  "asteroidPool": null,         // Pool of reusable asteroid objects
  "particlePool": null,         // Pool of reusable particle objects
  "smallPiecePool": null        // Pool of reusable small piece objects
};

// Global reference to game object
const G = Game;

function preload() {
  try {
    G.bl = loadSound("sound/bangLarge.wav");
    G.sm = loadSound("sound/bangSmall.wav");
    G.bm = loadSound("sound/bangMedium.wav");
    G.bt2 = loadSound("sound/beat2.wav");
    G.bt1 = loadSound("sound/beat1.wav");
    G.fire = loadSound("sound/fire.wav");
    G.xtraship = loadSound("sound/extraShip.wav");
    G.ss = loadSound("sound/saucerSmall.wav");
    G.bs = loadSound("sound/saucerBig.wav");
    G.thruster = loadSound("sound/thrust.wav");
    G.bkg = loadImage("IMG/stars.jpg");
    G.shipimg=[loadImage("IMG/mship1.png")];
  } catch (error) {
    console.error("Error loading game assets:", error);
    // Continue with game even if some assets fail to load
  }
}
/**
 * Add score to all-time high scores array
 * @param {number} a - Score to add
 */
function addAlltime(a) {
  if (typeof game_over !== 'undefined' && game_over) {
    G.allTime.push(a);
    if (G.allTime.length >= 6) {
      G.newAT = G.allTime.sort().reverse();
      G.newAT.splice(-1, 1);
    }
  }
}
/**
 * Set up audio beat playback with specified interval
 * @param {number} a - Beat interval in milliseconds
 * @param {Object} b - Audio object to play (optional)
 */
function playBeat(a, b) {
  G.beat = a;
  // console.log(b);
  setInterval(() => {
    !b ? G.bt1.play() : b.play();
  }, G.beat);
}

// End game setup functions
class resetGame {
  constructor(isFullReset = false) {
    addAlltime(G.score);
    if (isFullReset) {
      G.score = G.ship[0] ? G.allTime[0] : 0;
    }
    G.parts = [];
    G.lasers = [];
    G.ship = [];
    G.asteroids = [];

    // Initialize object pools if not already done
    if (!G.asteroidPool) {
      this.initializePools();
    }

    // Reset all pools to inactive state
    this.resetPools();

    this.acount = 5;
    this.astnum;
      this.shipnum = 1;
    if (G.level.length > 0) {
      this.astnum = this.acount * G.level[0];
    } else {
      this.astnum = this.acount;
    }

    this.makeshp();
    this.makeast();
  }

  initializePools() {
    // Create asteroid pool
    G.asteroidPool = [];
    for (let i = 0; i < 150; i++) {
      let asteroid = new Asteroid();
      asteroid.active = false;
      G.asteroidPool.push(asteroid);
    }

    // Create particle pool
    G.particlePool = [];
    for (let i = 0; i < 1000; i++) {
      let particle = new Particles();
      particle.active = false;
      G.particlePool.push(particle);
    }

    // Create small piece pool (for asteroid fragments)
    G.smallPiecePool = [];
    for (let i = 0; i < 500; i++) {
      let piece = {
        x: 0,
        y: 0,
        r: 0,
        active: false
      };
      G.smallPiecePool.push(piece);
    }

    // Assign pool getter methods to G for global access
    G.getInactiveParticle = this.getInactiveParticle.bind(this);
    G.getInactiveAsteroid = this.getInactiveAsteroid.bind(this);
    G.getInactiveSmallPiece = this.getInactiveSmallPiece.bind(this);
  }

  resetPools() {
    // Reset asteroid pool
    G.asteroidPool.forEach(ast => {
      ast.active = false;
      ast.damg = 0;
      ast.contact = false;
      ast.smallPieces = [];
    });

    // Reset particle pool
    G.particlePool.forEach(p => {
      p.active = false;
      p.alpha = 255;
    });

    // Reset small piece pool
    G.smallPiecePool.forEach(p => {
      p.active = false;
    });
  }

  makeshp() {
    for (let i = 0; i < this.shipnum; i++) {
      let s = new Ships();
      if (s) {
        G.ship.push(s);
      }
    }
  }
  makeast() {
    // Activate asteroids from pool instead of creating new ones
    for (let j = 0; j < this.astnum; j++) {
      let asteroid = this.getInactiveAsteroid();
      if (asteroid) {
        asteroid.active = true;
        // Reset asteroid properties
        asteroid.pos = createVector(random(width), random(height));
        asteroid.r = random(15, 60);
        asteroid.damg = 0;
        asteroid.contact = false;
        asteroid.maxDamage = Math.max(50, (asteroid.r / 60) * 250);
        asteroid.vel = p5.Vector.random2D();
        asteroid.vel.mult(random(0.5, 2));
        asteroid.smallPieces = [];
        G.asteroids.push(asteroid);
      }
    }
  }

 getInactiveAsteroid() {
   return G.asteroidPool.find(ast => !ast.active);
 }

 getInactiveParticle() {
   return G.particlePool.find(p => !p.active);
 }

 getInactiveSmallPiece() {
   return G.smallPiecePool.find(p => !p.active);
 }
}
class it_hit {
  constructor(obj1, inc) {

      inc ? inc :()=>{
        return this.inc;
       };
       obj1.hits(inc);
      
     if(inc.contact==true){ 
      console.log("it hits",inc,obj1);
        // console.log(obj1,obj1.contact,
        //   "start",
        //   inc,inc.contact
        // );

      // console.log("HIT",inc);
    }
      else{
        inc.contact = false;
        obj1.contact = false;
          // console.log("no hit");
      }
      
    
   
return inc.contact;
        
  }
  
}

function moving() {
  // console.log("G,window",G,window);
  // G.ship[0].setRotation();
  // G.ship[0].Moves = false;
  if (keyIsDown((keyCode = 38))) {
    if(!G.ship[0]){
       console.log("ship down");
      return;
}else{
       G.ship[0].boosting(true);
  }
    // G.ship[0].Moves = true;
  }

  return G;
};

function turning() {
  if (keyIsDown((keyCode = 37))) {
    G.ship[0].heading += -0.06;
  }
  if (keyIsDown((keyCode = 39))) {
    G.ship[0].heading += 0.06;
  }
  return G;
}
