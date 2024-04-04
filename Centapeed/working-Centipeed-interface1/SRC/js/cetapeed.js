var level = 1;
var GameScore = 0;
let jstick;
let dots = [];
let player = [];
let mush = [];
let lasers = [];
let shroom = [];
let x=0;
let y=0;
let windowResized;
let width=document.window;
let height=document.window;
let rs;
function setup() {
new Canvas(300,600,WEBGL)
pos()

  colorMode(HSB, 360, 100, 100);
  background(150, 100);



  document.addEventListener(
    "touchstart",
    ()=> {
      let x=mouseX
      if (lasers.length >= 5) {
        return
      }
      let x1 = player[0].pos.x;
      let y1 = player[0].pos.y;
      let x2 = mouseX;
      let y2 = mouseY;
  let v1 = createVector(x1, y1);
  let v2 = createVector(x2, y2);
  print(v1.heading()); // 1.0303768265243125
      lasers.push(new Laser(player[0].pos, 5, 5));
      let d = int(dist(v1.x,v1.y, v2.x, v2.y))
      console.log(d)
      return true; 
},false)

  plr = function () {

    if (player.length < 1) {
      for (var p = 0; p < 1; p++) {
        player.push(new Player(100, 50, 1.5));
      }
    }
  }
  plr();

  ///dots setup
  Dts = function (r,cnt) {
     r = 25;

    for (var d = 0; d < cnt; d++) {
      dots.push(new Dot(r + r * d, 0));

    }
  }
  Dts(25,10);

  Msh = function () {
    for (var m = 0; m < shroom.length; m++) {
      shroom.push(new Much())
    }
  }

  ////

  playerLoad = function () {
    for (p in player) {
      player[p].move()
      player[p].render()
      player[p].edges()

      //player[p].keyPressed()
      for (d in dots) {
        if (player[p].hits(dots[d])) {
          // dots.unshift(mush);
          dots.slice(d, 1);
        }
      }
    }
  }
  MushLoad = function () {
    for (m in mush) {
      mush[p].update();
      mush[p].show();
      mush[p].hits(dots[d]);
      if (mush[p].hits(dots[d])) {
        console.log("Mushroom hit");
      }


      //player[p].keyPressed()
      for (d in dots) {
        if (player[p].hits(dots[d])) {
          // dots.unshift(mush);
          dots.slice(d, 1);
        }
      }
    }
  }

  dotsLoad = function () {
    for (let d = 0; d < dots.length; d++) {
      if (dots.length === 0) {
        Dts();
      }

      dots[d].move();
      dots[d].show();
      for (let l = lasers.length - 1; l > -1; l--) {
        if (dots.length === 0 || lasers.length === 0) {
          return
        };
        if (dots[d].hits(lasers[l])) {
          lasers.splice(l, 1)
          dots.splice(d, 1);
          if (dots.length <= 0) {
            levelup();
             GameScore+= 1;
             console.log('Level Up')
          }
        }
      }
    }
  }

  // 
  levelup = function () {
    level = level + 1
    Dts();
    // dots.sp = dots.sp += 1;

  }
  //Game Text in hud



  //Keyboard Fire Mechinism
  keyPressed = () => {

    if (keyCode === (96)) {
      if (lasers.length >= 5) {
        return
      }
      console.log("fire");
      lasers.push(new Laser(player[0].pos, 5, 5));
    }
    return
  };
  /// create random Master FIELD
  field = []
  for (var f = 0; f < 256; f++) {
    num = floor(random(1, 6))
    FIELD.push(num)
  }
  //distribute field with Tiles using FIELD
  for (var i = 0; i < FIELD.length; i++) {
    var row = FIELD[i];
    field.push(new Tile(i % 16, Math.floor(i / 16), row))

    for (var f = 0; f < field.length; f++) {
      var mnm = field[f];
      if (field[f] >= 6) {
        mush.push(new Tile(mouseX, mouseY, mnm))
      };
    }

  }
  fld();
rs=resizeCanvas(350,600);
}

function draw() {
  // orbitControl();
  translate( -200,-300,-75);
  background(30, 80, 80, 100);
  
  document.getElementById('one').innerHTML = GameScore;
  document.getElementById('two').innerHTML = level;
  document.getElementById('three').innerHTML = dots.length;
  document.getElementById('four').innerHTML = lasers.length;
  document.getElementById('five').innerHTML = field.length;
  
  msh();
  dotsLoad();
  playerLoad();  
  loadLaser();

};

windowResized=() =>{
     return rs;
  }


fld = function () {

  field.forEach((fl)=>{
fl.draw();
  })
  
}
msh = function () {
  for (var j = 0; j < mush.length; j++) {
    mush[j].draw();
  }
}
levelup = function () {
  level = level + 1
  Dts();
  GameScore += 1;
}

function pos(x,y){createVector(x,y)};

class Canvas{
  constructor(x,y,contentType){

  if(!x){x=350};
  if(!y){y=600};
  if(contentType){contentType=WEBGL};
  const canvas=createCanvas(x,y, contentType).parent("can");
  // let xl= canvas.position().x;
  // let yl= canvas.position().y;
  document.getElementById("can").style.position = "inherit";
}}