//preload media

const Game = {
  "allTime": [0, 0, 0, 0, 0],
  "beat": 4400,
  "level": [],
  "ship": "ship",
  "asteroids": "asteroids",
  "levelArray": "levelArray",
  "parts": "parts",
  "lasers": "lasers",
  "offset": [],
  "parts": "parts",
  "newA": "newA",
  "newAT": "newAT",
  "bl": "bl",
  "sm": "sm",
  "bm": "bm",
  "bt2": "bt2",
  "bt1": "bt1",
  "fire": "fire",
  "xtraship": "xtraship",
  "ss": "ss",
  "bs": "bs",
  "thruster": "thruster",
  "bkg": "bkg",
  "gameStats":{}

};
const G = Game;

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
    G.thruster = loadSound("sound/thrust.wav"),
    G.bkg = loadImage("IMG/stars.jpg");
}
//todo.... contain

//end contain


function addAlltime(a) {
  if (game_over) {
    G.allTime.push(a);
    if (G.allTime.length >= 6) {
      G.newAT = G.allTime.sort().reverse();
      G.newAT.splice(-1, 1);
    }
  }
}
// create game setup function
function playBeat(a, b) {
  G.beat = a;
  // console.log(b);
  setInterval(() => {
    !b ? G.bt1.play() : b.play();
  }, G.beat);
}

//end create game funtion
class resetGame {
  constructor() {
    addAlltime(G.score);
    G.score = G.ship[0] ? G.allTime[0] : 0;
    G.parts = [];
    G.lasers = [];
    G.ship = [];
    G.asteroids = [];
    this.acount = 5;
    this.astnum;
      this.shipnum = 1;
    if (G.level.lenth > 0) {
      this.astnum = this.acount * G.level[0];
    } else {
      this.astnum = this.acount;
    }



this.makeshp();
this.makeast();

  }

 makeshp() {for (let i = 0; i < this.shipnum; i++) {
  let s = new Ships();
  if (s) {
    G.ship.push(s);
  }
}
}
 makeast(){for (let j = 0; j < this.astnum; j++) {
  let nw = new Asteroid();
  G.asteroids.push(nw);
}}}
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
