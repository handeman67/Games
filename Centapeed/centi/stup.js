var player = [];
var lasers = [];
var dot = [];
var FIELD = [];
var TYPE = ["BARRIER", "BISCUIT", "OPEN", "OPEN1", "OPEN2", "CHERRY", "CHERRY"];
var mush = [];
var level = 0;
var rgb;
const sizes = 20;

let rq=function requestAnimationFrame(){
   console.log(window.frameCount)
}
console.log(rq())//?

// function opts(){
 
const w = (innerWidth) - 30;
const h = (innerHeight) - 30;
let cw = w / 2;
let ch = h / 2;
let lw = cw / 2 - 35;
let lh = ch / 2;
let z = -275;
const cols = sizes;
const rows = sizes;

var SIZE = w / cols;
var THIRD_SIZE = SIZE / 3;
var HALF_SIZE = SIZE / 2
var QUARTER_SIZE = SIZE / 4

const center = w / 2
let scroll;

window.addEventListener('deviceorientation', function (e) {
  // reme0mber to use vendor-prefixed transform property

  var absolute = e.absolute;
  var alpha = e.alpha;
  var beta = e.beta;
  var gamma = e.gamma;
  var direction = 1
  // Do stuff with the new orientation data
  //     if (absolute){
  //       noLoop()
  //     }else if(gamma< 0){
  // directioon = -1
  //     }else if(beta<0){

  //     }
  console.log('absolute =' + absolute)
  console.log('alpha = ' + alpha)
  console.log('beta = ' + beta)
  console.log('gamma = ' + gamma)

  // elem.style.transform =
  //   'rotateZ(' + (e.alpha - 180) + 'deg) ' +
  //   'rotateX(' + e.beta + 'deg) ' +
  //   'rotateY(' + (-e.gamma) + 'deg)';

})

function preload() {
  myfont = loadFont('img/fontawesome-webfont.woff'),
    smile = loadImage('img/1280px-Smiley_green_alien_lol.svg.png'),
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

  //set angle to deg for easier manipulation
  angleMode(DEGREES);
  // Creating my canvas and conecting it to the dom.
  let canvas = createCanvas(w, h);
  canvas.parent("canv");

  //  Generate  players 
  for (let p = 0; p < 1; p++) {
    let s = 4;
    player.push(new Player(0 * p, 10, 90, s))
  };
  // Gnerate dots
  for (let d = 0; d < 10; d++) {
    let dotx = width / 4 + SIZE * d;
    let doty =SIZE;
    dot.push(new Dot(dotx, doty, SIZE, 12, 2))
  };
  // Generate obsticles
  //  for (let m = 0; m <size; m++) { for (let n = 0; n < 27; n++) { let r = 20;mush.push(new Mush(20+r*2*m , 80+r * 2 + r * n, r))}};
  //scroll for movement
  scroll = createSlider(0, w, center, 1)
  scroll.position(center, h)
  const obs = cols * rows;
  field = []
  for (var f = 0; f < obs; f++) {
    num = floor(random(0, 6))
    FIELD.push(num)
  }
  //distribute field with Tiles using FIELD
  for (var i = 0; i < FIELD.length; i++) {
    var row = FIELD[i];

    field.push(new Tile(i % cols, Math.floor(i / cols), row));
  }

}
// Draw the the game
function draw() {
  // translate(-cw, -ch, z)
  const slide = scroll.value()
  background(50, 50, 50, 0.8);
  fld(field);


  //render player

  for (let p in player) {

    player[p].render();
    player[p].move();
    player[p].edges();
    player[p].turn();
    for (let d in dot) {
      player[p].hits(dot[d]);
      if (player.hits) {
        console.log('player hit')
      }
    }
  }
  //render mush
  // for (let m = mush.length - 1; m > -1; m--) {
  //       mush[m].show

  // }

  //render laser
  for (let l = lasers.length - 1; l > -1; l--) {

    lasers[l].move();
    lasers[l].show();
    lasers[l].offScreen();
    for (let d in field.length) {
      if (lasers == 0) {
        console.log("no lasers")
      } else {
        if (lasers[l].hits(field[d])) {
          console.log("laser hit")
        }
      }

    };
  }

  for (let d = dot.length - 1; d > -1; d--) {
    dot[d].move();
    dot[d].show();
    for (let f in field.length) {
      if (dot[d].hits(field[f])) {


        dot[d].drop()
      }
    }
    for (l in lasers) {
      dot[d].hits(lasers[l])
    };
    if (dot.length === 0) {
      level++
      break
      //let lv =0
      for (let d = 0; d < 10; d++) {
        let r = 20;
        dot.push(new Dot(width / 2 + SIZE * d,SIZE,SIZE, 12));
      }
      //lv++
    }
  }


  keyPressed = (e) => {
    if (e.keyCode == 96) {

      lasers.push(new Laser(player[0].pos, player[0].heading, 2));

    }


  }
  words();
}

class Dot {
  constructor(x, y, SIZE, sp) {
    //
    this.pos = createVector(x, y);
    this.num = 2;
    this.sp =sp
    this.color = color(random(255), random(0), random(100))



    this.show = () => {
      push();
      stroke(0, 100, 0)
      strokeWeight(.005);
      image(smile, this.pos.x, this.pos.y, SIZE, SIZE);
      ellipse(this.pos.x, this.pos.y, SIZE)
      pop();
    };
    ///hit detection
    this.inc = [];
    this.inc.push("");
    this.hits = (inc) => {
      var d = dist(this.pos.x, this.pos.y, inc.pos.x, inc.pos.y);
      if (d <SIZE + inc.SIZE) {

console.log('dot hit this -->'+inc)


      }

    };

    ///
    this.move = () => {
      this.pos.x = this.pos.x += this.sp;
      if (this.pos.x < 0 + SIZE || this.pos.x > width - SIZE) {
        this.drop();

      }
    };

    this.drop = () => {
      this.pos.y = SIZE + this.pos.y;
      this.sp = -this.sp;
      if (this.pos.y > height -SIZE) {
        if (this.dt >= dot.length) {
          level++
        this.sp++
        this.pos.y = 100;
        this.pos.x = width / 2;
}
      }
    };
  }
}

words = () => {
  
push()
  fill(255,255,255);
  rect(0, 0, 200, 300, 20, 20, 0, 0)
   stroke(0);
   strokeWeight(4);
  textSize(20);
textStyle(BOLD);
  text("player   " + player.length, 20, 25, 200, 20);
  if (player.length == 0) {
   stroke(255, 0, 0);
    text("player   " + player.length, 20, 25, 200, 20);
  }
  text("Dot   " + dot.length, 20, 50, 200, 20);
  text("lasers   " + lasers.length, 20, 75, 200, 20);
  text("Mush   " + mush.length, 20, 100, 200, 20);
  text("Dot #   " + dot.dd, 20, 125, 200, 20);
  text("Level   " + level, 20, 150, 200, 20);
  text("player   " + player.length, 20, 175, 200, 20);
  pop()
  if (lasers.length >= 8) {
    push();
    stroke(255, 0, 0);
    text("lasers   " + lasers.length, 20, 75, 200, 20);
    pop();

  }
}
class Mush {

  constructor(x, y,SIZE) {
    this.pos = createVector(x, y);
    // this.sp = 5;
    this.show = () => {
      stroke(10, 255, 100, 255);
      strokeWeight(1);
      fill(100, 100, 100, 255);
      image(mushroom,this.x * SIZE, this.y * SIZE, SIZE, SIZE);
      ellipse(this.pos.x, this.pos.y, SIZE);
    };
    this.update = () => {

      //this.r=this.r-1
    }
    ///hit detection
    this.inc = [];
    this.inc.push("");
    this.hits = (inc) => {
      var d = dist(this.pos.x, this.pos.y, inc.pos.x, inc.pos.y);
      if (d < SIZE + inc.SIZE) {

        return true;
      }
    };
  }
}
class Player {
  constructor(pos, SIZE, spd,a) {

    pos = createVector(0, 0);
    this.pos=pos;
    
    
    this.heading = 0;
    this.rotation = 0;
    this.spd = spd;

    this.move = () => {
      if (keyIsDown(97)) {
        this.setRotation(-1);
      } else if (keyIsDown(98)) {
        this.setRotation(1);
      } else {
        this.setRotation(0);
      }
      if (keyIsDown(37)) {
        this.pos.x -= this.spd;
      }
      if (keyIsDown(39)) {
        this.pos.x += this.spd;
      }
      if (keyIsDown(38)) {
        this.pos.y -= this.spd;
      }
      if (keyIsDown(40)) {
        this.pos.y += this.spd;
      }
      if (keyIsDown(99)) {
        this.heading = 0;
      }

      function keyReleased(keyCode) {
        this.setRotation(0);
        //this.heading=0;
      }

    };


    this.render = () => {
      var red = 100;
      var green = 255 - damg;
      var blue = 0 - damg;
      var damg = 50;
      push();
      translate(this.pos.x, this.pos.y);
      rotate(this.heading + PI / 2);
      this.shipFrame = stroke(0, 255, 255);
      fill(red, green, blue);
      triangle(-SIZE, SIZE, SIZE, SIZE, 0, -SIZE - 10);
      pop();
      // 
    };
    this.edges = () => {
      if (this.pos.x > width - SIZE * 2) {
        this.pos.x = width - SIZE * 2;
      } else if (this.pos.x < SIZE * 2 + 5) {
        this.pos.x = SIZE * 2 + 5;
      }
      if (this.pos.y > height - SIZE * 2) {
        this.pos.y = height - SIZE * 2;
      } else if (this.pos.y < height / 1.3) {
        this.pos.y = height / 1.3;
      }
    };
    this.inc = [];
    this.inc.push("");

    this.hits = (inc) => {
      var d = dist(this.pos.x, this.pos.y, inc.pos.x, inc.pos.y);
      if (d < SIZE + inc.SIZE) {

        player.fill(255, 0, 0)

        return true;
      }
    };
    this.setRotation = (a) => {
      this.rotation = a;
    };
    this.turn = () => {
      this.heading += this.rotation;
    };
  }
}
class Laser {
  constructor(spos, angle,SIZE) {
    this.hit = false;
    this.sp = 5;
    this.angle = 0;
    this.heading = 180;
   this.pos = createVector(spos.x, spos.y - 10);
    this.vel = p5.Vector.fromAngle(this.heading);
    this.heading += rotate;
    this.vel.mult(0.9);
    this.update = () => {
      this.pos.add(this.vel);
    };

    this.show = () => {
      push();
      stroke(255);
      strokeWeight(SIZE * 2);
      fill(100, 255, 200);
      point(this.pos.x, this.pos.y - 10);
      pop();
    };
    this.inc = [];
    this.inc.push("");
    this.hits = (inc) => {
      var d = dist(this.pos.x, this.pos.y, inc.pos.x, inc.pos.y);
      if (d < SIZE + inc.SIZE) {


        if (this.hit = true) {
          lasers.slice(1, 1)
        }
      }
    };

    this.move = () => {
      this.pos.y -= this.sp;
    };
    this.offScreen = () => {
      if (this.pos.x < 0 || this.pos.x > width) {
        lasers.splice(0, 1);
      }
      if (this.pos.y < 0 || this.pos.y > height) {
        lasers.splice(0, 1);
      }
    };
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