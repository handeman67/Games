var player = [];
var lasers = [];
var dot = [];
var FIELD = [];
var TYPE = ["BARRIER", "BISCUIT", "OPEN", "OPEN1", "OPEN2", "CHERRY", "CHERRY"];
var mush = [];
var level = 0;
var rgb;
const sizes = 30;
// function opts(){

const w = document.getElementsByClassName("wrap")[0].clientWidth; //?
const h = document.getElementsByClassName("wrap")[0].clientHeight - 50; //?
let centerw = w / 2;
let centerh = h / 2;
let lw = centerw / 2 - 35;
let lh = centerh / 2;
let z = -275;
const cols = sizes;
const rows = sizes;

var SIZE = w / cols;
var THIRD_SIZE = SIZE / 3;
var HALF_SIZE = SIZE / 2;
var QUARTER_SIZE = SIZE / 4;
let scroll;

window.addEventListener('deviceorientation', function (e) {

  var absolute = e.absolute;
  var alpha = e.alpha;
  var beta = e.beta;
  var gamma = e.gamma;
  var direction = 1;
  // Do stuff with the new orientation data
  //     if (absolute){
  //       noLoop()
  //     }else if(gamma< 0){
  // directioon = -1
  //     }else if(beta<0){

  //     }
  // console.log('absolute =' + absolute);
  // console.log('alpha = ' + alpha);
  // console.log('beta = ' + beta);
  // console.log('gamma = ' + gamma);

  // elem.style.transform =
  //   'rotateZ(' + (e.alpha - 180) + 'deg) ' +
  //   'rotateX(' + e.beta + 'deg) ' +
  //   'rotateY(' + (-e.gamma) + 'deg)';

});

function preload() {
  // myfont = loadFont('img/fontawesome-webfont.woff'),
  smile = loadImage('img/800px-Smiley_green_alien_deep_sleep.svg.png'),
    sleep = loadImage('img/800px-Smiley_green_alien_deep_sleep.svg.png'),
    flustered = loadImage('img/800px-Smiley_green_alien_flustered.svg.png'),
    satisfied = loadImage('img/800px-Smiley_green_alien_satisfied.svg.png'),
    Grr = loadImage('img/800px-Smiley_green_alien_GRRR.svg.png'),
    blush = loadImage('img/Smiley_green_alien_blush.svg.png'),
    big = loadImage('img/Smiley_green_alien_big_eyes.svg.png'),
    sick = loadImage('img/Smiley_green_alien_sickoff.svg.png'),
    mushroom = loadImage('img/mushroom.svg'),
    mushroom1 = loadImage('img/mushroom1.svg'),
    mushroom2 = loadImage('img/mushroom2.svg'),
    spider = loadImage('img/spider.svg'),
    grass = loadImage('img/grass.svg'),
    grass1 = loadImage('img/grass1.svg'),
    grass3 = loadImage('img/grass3.svg'),
    stinkbug = loadImage('img/stink-bug.svg')

}

function setup() {
  angleMode(DEGREES);
  const canvas = createCanvas(w, h).parent("#canv");
  PlayerLoad();
  DotLoad();
  // Generate obsticles
  //  for (let m = 0; m <size; m++) { for (let n = 0; n < 27; n++) { let r = 20;mush.push(new Mush(20+r*2*m , 80+r * 2 + r * n, r))}};
  FieldLoad();
}

function FieldLoad() {
  field = [];
  fieldSet();
  fieldLoad();

  function fieldLoad() {
    for (var i = 0; i < FIELD.length; i++) {
      var row = FIELD[i];
      field.push(new Tile(i % cols, Math.floor(i / cols), row));
    }
  }

  function fieldSet() {
    const obs = cols * rows - (10 * rows);
    for (var f = 0; f < obs; f++) {
      num = floor(random(1, 4));
      FIELD.push(num);
      // console.log(num);
    }
  }
}

function DotLoad() {
  for (let d = 0; d < 1; d++) {
    let dotx = width / 4 + SIZE * d;
    let doty = SIZE;
    dot.push(new Dot(dotx, doty, SIZE, 1.5));
  };
}

function PlayerLoad() {
  for (let p = 0; p < 1; p++) {
    let s = 4;
    player.push(new Player(0 * p, 10, 10, s));
  };
}

// Draw the the game
function draw() {
  // translate(-cw, -ch, z)
  background(0);
  fld(field);
  PlayerAction();
  shootingAction();
  laserHit();
  // console.log(rq())//?
  //render mush
  // for (let m = mush.length - 1; m > -1; m--) {
  //       mush[m].show

  // }




  for (let d = dot.length - 1; d > -1; d--) {
    dot[d].move();
    dot[d].show();
    for (let f in field) {
      // if(field[f].type ===2 || field[f].type === 5) {
      if(dot[d].hit === true) {
      
      console.log("field",field[f]);
    //   if (dot[d].hits(field[f])) {
    //     if (field[f].type === 2) {
    //     console.log("dot hit mushroom");

    //     dot[d].drop();
    //   }
    // }
  // }
}
    }
    if (dot.length === 0) {
      level++
      //let lv =0
      for (let d = 0; d < 10; d++) {
        let r = 20;
        dot.push(new Dot(dotx, doty, SIZE, 0));
      }
      //lv++
    }
  }


  keyPressed = (e) => {
    if (e.keyCode == 96 || e.keyCode == 32) { // numpad 0 or spacebar
      if (player.length > 0) {
        lasers.push(new Laser(player[0].pos, player[0].heading, 2));
      }
    }
  }
  // words();

  function shootingAction() {
    for (let l = lasers.length - 1; l >= 0; l--) {
      lasers[l].move();
      lasers[l].show();
      
      // Remove if off screen
      if (lasers[l].offScreen()) {
        lasers.splice(l, 1);
      }
    }
  }
  
  function laserHit() {
    // Check laser collisions with field tiles (mushrooms)
    for (let l = lasers.length - 1; l >= 0; l--) {
      if (!lasers[l]) continue;
      
      let laserHit = false;
      
      // Check collision with field tiles
      for (let f = 0; f < field.length; f++) {
        if (!field[f]) continue;
        
        // Only check mushroom tiles (types 1, 5, 6)
        if (field[f].type === 1 || field[f].type === 5 || field[f].type === 6) {
          if (field[f].hits(lasers[l])) {
            // Mushroom hit!
            field[f].takeDamage(25);
            laserHit = true;
            
            // Remove mushroom tile if destroyed
            if (field[f].mushroom && field[f].mushroom.isDestroyed) {
              console.log("Mushroom destroyed!");
            }
            
            break; // Laser can only hit one thing
          }
        }
      }
      
      // Check collision with dots (enemies)
      if (!laserHit) {
        for (let d = 0; d < dot.length; d++) {
          if (!dot[d]) continue;
          
          if (lasers[l].hits(dot[d])) {
            dot[d].hit = true;
            laserHit = true;
            console.log("Dot hit!");
            break;
          }
        }
      }
      
      // Remove laser if it hit something
      if (laserHit) {
        lasers.splice(l, 1);
      }
    }
  }
 

  function PlayerAction() {
    for (let p in player) {
      player[p].render();
      player[p].move();
      player[p].edges();
      player[p].turn();
     
      for (let d in dot) {
        // console.log('dot', dot[d]);
        // console.log('player', player[p]);
        player[p].hits(dot[d]);
        if (dot[d].hit) {
          console.log('player hit');
        }
      }
    }
  }
}

fld = function (field) {
  for (var i = 0; i < field.length; i++) {
    field[i].draw();
  }
};

function windowResized() {
  resizeCanvas(innerWidth, innerHeight)
}
