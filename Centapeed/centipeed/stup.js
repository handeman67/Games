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
 
const w =document.getElementsByClassName("wrap")[0].clientWidth;//?
const h =document.getElementsByClassName("wrap")[0].clientHeight-50;//?
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
  console.log('absolute =' + absolute);
  console.log('alpha = ' + alpha);
  console.log('beta = ' + beta);
  console.log('gamma = ' + gamma);

  // elem.style.transform =
  //   'rotateZ(' + (e.alpha - 180) + 'deg) ' +
  //   'rotateX(' + e.beta + 'deg) ' +
  //   'rotateY(' + (-e.gamma) + 'deg)';

});

function preload() {
  myfont = loadFont('img/fontawesome-webfont.woff'),
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
  const canvas = createCanvas(w, h).parent("canv"); 
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
       const obs = cols * rows-(15*rows);
    for (var f = 0; f < obs; f++) {
      num = floor(random(0, 6));
      FIELD.push(num);
    }
  }
}

function DotLoad() {
  for (let d = 0; d < 10; d++) {
    let dotx = width / 4 + SIZE * d;
    let doty = SIZE;
    dot.push(new Dot(dotx, doty, SIZE, 10, 0.005));
  }
  ;
}

function PlayerLoad() {
  for (let p = 0; p < 1; p++) {
    let s = 4;
    player.push(new Player(0 * p, 10, 10, s));
  }
  ;
}

// Draw the the game
function draw() {
  // translate(-cw, -ch, z)
  background(0);
  fld(field);
  PlayerAction();
  shootingAction();
  // console.log(rq())//?
  //render mush
  // for (let m = mush.length - 1; m > -1; m--) {
  //       mush[m].show

  // }

  


  for (let d = dot.length - 1; d > -1; d--) {
    dot[d].move();
    dot[d].show();
    for (let f in field.length) {
      if (dot[d].hits(Tile(100,100,1))) {
console.log("dot hit mushroom")

        dot[d].drop()
      }
    }
    for (l in lasers) {
      dot[d].hits(lasers[l])
    };
    if (dot.length === 0) {
      level++
      //let lv =0
      for (let d = 0; d < 10; d++) {
        let r = 20;
        dot.push(new Dot(dotx, doty, SIZE, 10,0));
      }
      //lv++
    }
  }


  keyPressed = (e) => {
    if (e.keyCode == 96) {

      lasers.push(new Laser(player[0].pos, player[0].heading, 2));

    }


  }
  // words();

  function shootingAction() {
    for (let l = lasers.length - 1; l > -1; l--) {
      lasers[l].move();
      lasers[l].show();
      lasers[l].offScreen();
      laserHit(l);
          }

    function laserHit(l) {
      for (let d in field.length) {
        if (lasers == 0) {
          console.log("no lasers");
        }
        else {
          if (lasers[l].hits(field[d])) {
            console.log("laser hit"+field[d]);
          }
        }
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
        player[p].hits(dot[d]);
        if (player.hits) {
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
}

function windowResized() {
  resizeCanvas(innerWidth, innerHeight)
}