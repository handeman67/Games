parts = [];
var level = [];
var damg = 0;
var lasers = [];
// var life = [];
// var Level = 5;

var red = 255;
var green = 255 - damg;
var blue = 255 - damg;
var cans;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function preload() {
  (bl = loadSound("sound/bangLarge.wav")),
  (sm = loadSound("sound/bangSmall.wav")),
  (bm = loadSound("sound/bangMedium.wav")),
  (bt2 = loadSound("sound/beat2.wav")),
  (bt1 = loadSound("sound/beat1.wav")),
  (fire = loadSound("sound/fire.wav")),
  (xtraship = loadSound("sound/extraShip.wav")),
  (ss = loadSound("sound/saucerSmall.wav")),
  (bs = loadSound("sound/saucerBig.wav")),
  (thrust = loadSound("sound/thrust.wav")),
  (bkg = loadImage("IMG/stars.jpg"));
}


function setup() {

  cans = createCanvas(innerWidth - 30, innerHeight - 30, "WEBGL");
  cans.parent("agame");
  resetGame();
  Controls();
  button();
  // sap=new shapes(50,50,0,50,50);
}

function draw() {
  // sap.clicked();
  // sap.showCoords();
  // sap.clickedL();
  // sap.paddles();
  // sap.render();
  if (damg >= 255) {
    ship.splice(0, 1);
    damg = 0;
  }
  

  // LEVELS();
  background(bkg);
  damage();
  lives();
  words();
  Scored();
  LevelT();
 
  if (ship.length <= 0 || undefined) {
    ship.splice[0];
    gameOver();
    //noLoop();
  }
  if (ship.length >= 1) {
    let s=ship[0];
    s.move();s.render();s.update();s.turn();s.edges();s.shiphits();
    //ship[0].defend();
  }

  for (let j = asteroids.length - 1; j >= 0; j--) {
    let a =asteroids[j];
    a.render();a.update();a.edges();
   
  }

  for (let p = parts.length - 1; p > 0; p--) {
    let P =parts[p];
    P.show();P.update();P.cleared();
     if (parts[p].cleared()) {
      parts.splice(0, 1); 
    } //console.log(valueOf.parts)
  }  

  for (let l = lasers.length - 1; l >= 0; l--) {     
    if (lasers[l].offscreen()) {
      lasers.splice(l, 1); 
    }
      for (let j = asteroids.length - 1; j >= 0; j--) {
        if (lasers[l].hits(asteroids[j])) {
          console.log(lasers[l]);
          bl.play();
          score += 1 * floor(A.r);

          let newParts = A.pts();
          parts = parts.concat(newParts);

          if (A.r > 15) {
            let newAsteroids = A.breakup();
            asteroids = asteroids.concat(newAsteroids);
            score += 3 * floor(A.r);
          }
          asteroids.splice(j, 1);
          lasers.splice(l, 1);

          break;
        }
      }
    }
  }

  // defend();

  //     for (var l = lasers.length - 1; l >= 0; l--) {
  //         lasers[l].render();
  //         lasers[l].update();
  //         if (lasers[l].offscreen()) {
  //             lasers.splice(l, 1);
  //         }
  //          else {
  //             for (var j = asteroids.length - 1; j >= 0; j--) {
  //                 if (lasers[l].hits(asteroids[j])) {

  //                     bl.play();
  //                     score += 3 * 13;

  //                     var partsVel = p5.Vector.add(lasers[l].vel.mult(0.2), 5)
  //                     var partsNum = (asteroids[j].r);

  //                 asteroids[j].explode()

  //                     if (asteroids[j].r > 15) {

  //                         var newAsteroids = asteroids[j].breakup();
  //                         asteroids = asteroids.concat(newAsteroids);
  //                     }
  //                     asteroids.splice(j, 1);
  //                     lasers.splice(l, 1);

  //                     break
  //                 }

  //             }
  //         }
  //     }
  // }

  // ufo= function(){

  //     setInterval(ufo() , 11000);
