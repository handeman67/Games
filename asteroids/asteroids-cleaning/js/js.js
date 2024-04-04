

//ovious
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function setup() {
var cans;
  cans = createCanvas(innerWidth - 30, innerHeight - 30, P2D);
  cans.parent("agame");
  new resetGame();
  Controls();
  button();
  
}

function draw() {
// st()
if (G.ship[0]){
   if (G.ship[0].damg >= 25) {
    G.ship.splice(0, 1);
  }
}
 
background(G.bkg);
  damage();
  lives();
  FRAMERATE();
  Scored();
  LevelT();

  if (G.ship.length <= 0 || undefined) {
    G.ship.splice[0];
    
  }
  
  if (G.ship.length >= 1) {
    let s=new Ship();
    s.update();
    
   
    //ship[0].defend();
  }else{
    gameOver()}
  for (let j = G.asteroids.length - 1; j >= 0; j--) {
    let a =G.asteroids[j];
    push()
    a.render();a.update();a.edges();
    pop()
   }
  for (let p = G.parts.length - 1; p > 0; p--) {
    let P =G.parts[p];
    P.show();P.update();P.cleared();
     if (G.parts[p].cleared()) {
      G.parts.splice(0, 1); 
    } //console.log(valueOf.parts)
  }  
  for (let l = G.lasers.length - 1; l >= 0; l--) {
    G.lasers[l].render();
    G.lasers[l].update();
    if (G.lasers[l].offscreen()) {
      G.lasers.splice(l, 1); 
    }
  if (G.asteroids.length <= 0 ){
    G.level.push(l);
       new resetGame();
        }
      for (let j = G.asteroids.length - 1; j >= 0; j--) {
    
        let A=G.asteroids[j];
        if(!G.lasers[l]){return}
        if (G.lasers[l].hits(A)) {
          G.bl.play();
          G.score += 1 * floor(A.r);
          A.pts();
          if (A.r > 15) {
           A.breakup();
            G.score += 3 * floor(A.r);
          } 
          G.asteroids.splice(j, 1);
          G.lasers.splice(l, 1);}
      }
    }

    words();
  }
