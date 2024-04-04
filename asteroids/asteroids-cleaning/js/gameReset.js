//preload media

const Game={
  "allTime":"allTime",
  "beat":"beat",
  "level":"level",
  "ship":"ship",
  "asteroids":"asteroids",
  "levelArray":"levelArray",
  "parts":"parts",
  "lasers":"lasers",
  "offset":"offset",
  "parts":"parts",
  "newA":"newA",
  "newAT":"newAT",
  "bl":"bl",
  "sm":"sm",
  "bm":"bm",
  "bt2":"bt2",
  "bt1":"bt1",
  "fire":"fire",
  "xtraship":"xtraship",
  "ss":"ss",
  "bs":"bs",
  "thrust":"thrust",
  "bkg":"bkg",
  
}
 G = Game;
function preload() {
  G.bl = loadSound("sound/bangLarge.wav"),
  G.sm = loadSound("sound/bangSmall.wav"),
  G.bm = loadSound("sound/bangMedium.wav"),
  G.bt2 = loadSound("sound/beat2.wav"),
  G.bt1 = loadSound("sound/beat1.wav"),
  G.fire = loadSound("sound/fire.wav"),
  G.xtraship = loadSound("sound/extraShip.wav"),
  G.ss = loadSound("sound/saucerSmall.wav"),
  G.bs = loadSound("sound/saucerBig.wav"),
  G.thrust = loadSound("sound/thrust.wav"),
  G.bkg = loadImage("IMG/stars.jpg");
}
G.beat=2000;
 G.allTime = [0,0,0,0,0];
 G.level=[]; 
 G.offset=[];
function addAlltime(a){
    if (game_over) {
      G.allTime.push(a);
      if (G.allTime.length >= 6) {
        G.newAT= G.allTime.sort().reverse();
        G.newAT.splice(-1, 1);
    }   
  }
}

setInterval(() => {
  G.bt1.play();
}, G.beat);

class resetGame {
  constructor() {
    addAlltime(G.score);
    G.score = G.ship[0] ? G.allTime[0] : 0;
    G.parts = [];
    G.lasers = [];
    G.ship = [];
    G.asteroids = [];
    this.acount = 20;
    let astnum,
     shipnum = 1;
    if (G.level.length) {
      astnum = this.acount * G.level.length;
    } else {
      astnum = this.acount;
    }
    
    for (let i = 0; i < shipnum; i++) {
      G.ship.push(new Ship());
    }

    for (let j = 0; j < astnum; j++) {
      let nw =new Asteroid();
      G.asteroids.push(nw);
    }


  }
}

