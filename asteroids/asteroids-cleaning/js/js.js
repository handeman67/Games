//ovious
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
const c = new Controls();

function setup() {
  let cans;
  cans = createCanvas(innerWidth - 30, innerHeight - 30, P2D);
  cans.parent("agame");
  new resetGame();
  c.button();
  playBeat(2500, G.thruster);
}

function draw() {
  if ("change") {
    const c = new Controls();
  }

  background(G.bkg);
  clearShip();
  turning();
  moving();
  shipDamage(225);

  c.words();
  Ships.damg;
  // lives();
  // FRAMERATE();
  // Scored();
  // LevelT();

  drawShip();
  drawAsteroid();


}

function keyReleased() {
  if (keyCode == 37 || 38) {
    // G.ship[0].setRotation(0)* -1;
    if (!G.ship[0]) {
      return;
    } else {
      G.ship[0].boosting(false);
    }
  }
}

function keyPressed() {
  if (keyCode == 32) {
    if(G.ship[0]){G.lasers.push(new Laser(G.ship[0].pos, G.ship[0].heading));}
    G.fire.play();
  }

}
