function Controls() {
  //GAME
  button = () => {
    button2 = createButton("Reset"),
      button2.mousePressed(resetGame),
      button2.position(width / 2, 30),
      button3 = createButton("close"),
      //button3.mousePressed(level),
      button3.position(width / 2 + 60, 30);
  };

  Scored = () => {
    stroke(0, 200, 20);
    fill(255);
    textSize(25);
    text("Score" + "  " + score, 10, 10, 200, 100);
  };

  LevelT = () => {
    stroke(0, 200, 20);
    fill(255);
    textSize(25);
    text("Level" + "  " + level, width / 1.3, 10, 200, 100);

  };

  lives = () => {
    var red = 255;
    var green = 255 - this.damg;
    var blue = 255 - this.damg;
    stroke(0, 200, 20);
    fill(255);
    textSize(25);
    text("lives" + "  " + ship.length, 73, 40, 200, 100);
    push();
    translate(40, 55);
    fill(red, green, blue, 255);
    triangle(-10, 10, 10, 10, 0, -10);
    pop();
  };
  damage = () => {
    var red = 255;
    var green = 255 - this.damg;
    var blue = 255 - this.damg;
    push();
    fill(red, green, blue, 255);
    text("Damage" + "  " + this.damg, 30, 70, 225, 100);
    pop();

  };
  st = () => {
    if (st === true) {
      return false;
    } else {
      var script = document.createElement("script");
      script.onload = function () {
        var stats = new Stats();
        stats.domElement.style.position = "absolute";
        stats.domElement.style.left = "210px";
        stats.domElement.style.top = "40px";
        document.body.appendChild(stats.dom);
        requestAnimationFrame(function loop() {
          stats.update();
          requestAnimationFrame(loop);
        });
      };
      script.src = "//rawgit.com/mrdoob/stats.js/master/build/stats.min.js";
      document.head.appendChild(script);
    }
  };

  words = (x, y) => {
    push();
    fill(0, 200, 20, 150);
    textSize(15);
    textAlign(CENTER);
    this.text("Move", width - 225, height - 125, 100, 100);
    this.text("Fire", 155, height - 125, 100, 100);
    return;
    pop();
  };
  // var ast =[];
  // var sss;
  // var xx;
  // var yy;
  // var aa;
  // var q;

  // = rslidebar.value();
  // var g = gslidebar.value();
  // var b = bslidebar.value();
  // var a = aslidebar.value();
  // var sss = slidderVolume0.value();
  // var xx = slidderVolume1.value();
  // var yy = slidderVolume2.value();
  // var aa = slidderVolume3.value();
  // var q = slidderVolume4.value();
  // var wm = windowWidth / 2;
  // var hm = windowHeight / 2;
}
// function Life(damg) {
//   damg = this.damg;
//   render = function() {
//     push();
//     translate(this.x, this.y);
//     stroke(0, 200, 20);
//     fill(damg);
//     triangle(-5, 5, 5, 5, 0, -5);
//     pop();
//   };
// }
// function edges(this)
//   {

//     if (this.pos.x > width + this.r) {
//       this.pos.x = -this.r;
//     } else if (this.pos.x < -this.r) {
//       this.pos.x = width + this.r;
//     }
//     if (this.pos.y > height + this.r) {
//       this.pos.y = -this.r;
//     } else if (this.pos.y < -this.r) {
//       this.pos.y = height + this.r;
//     }
//   };