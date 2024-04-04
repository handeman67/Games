function Controls() {
  this.myred = 255;
  this.mygreen = 255 - this.damg;
  this.myblue = 255 - this.damg;
  //GAME
  let gg =
    button = () => {
      button2 = createButton("Reset"),
        button2.mousePressed(() => {
          return new resetGame
        }),
        button2.position(width / 2, 30),
        button3 = createButton("close"),
        button3.position(width / 2 + 60, 30);
      button4 = createButton("sound"),
        button4.position(width / 2 + 120, 30);
    };

  Scored = () => {
    stroke(0, 200, 20);
    fill(255);
    textSize(25);
    text(`Score:${G.score}`, 10, 10, 200, 100);
  };

  LevelT = () => {
    stroke(0, 200, 20);
    fill(255);
    textSize(25);
    text(`Level: ${G.level.length}`, width / 1.3, 10, 200, 100);

  };

  lives = () => {

    stroke(this.myred, this.mygreen, this.myblue);
    fill(255);
    textSize(25);
    text(`lives ${G.ship.length}`, 73, 40, 200, 100);
    push();
    translate(40, 55);
    fill(this.myred, this.mygreen, this.myblue, 255);
    triangle(-10, 10, 10, 10, 0, -15);
    pop();
  };
  damage = () => {
    !G.ship[0] ? b = G.ship.length : b = G.ship[0].damg;
    push();
    fill(this.myred, this.mygreen, this.myblue, 255);
    text(`Damage ${b}`, 30, 70, 225, 100);
    pop();

  };
  st = () => {
    if (st === true) {
      return false;
    } else {
      var script = document.createElement("script");
      let r = document.querySelector(".result");
      script.onload = function () {
        var stats = new Stats();

        r.append(stats.dom);
        // requestAnimationFrame(function loop() {
        //   stats.update();
        //   requestAnimationFrame(loop);
        // });
      };
      script.src = "./js/Stats.js";
      document.head.appendChild(script);
    }
  };

  words = (x, y) => {
    let t = this;
    t.mx = width - 220;
    t.my = height - 225;
    t.fx = 225;
    t.fy = height - 225;

    t.heading = 0;
    t.rotation = 0;
    t.mpos = createVector(t.mx, t.my);
    t.fpos = createVector(t.fx, t.fy);
    t.fire = {
      "x": t.fpos.x,
      "y": t.fpos.y
    }
    t.move = {
      "x": t.mpos.x,
      "y": t.mpos.y
    }
    fill(20, 20, 20, 150);
    push();

    ellipseMode(RADIUS);
    ellipse(t.move.x, t.move.y, 50);
    ellipse(t.fire.x, t.fire.y, 50);

    fill(0, 200, 20, 150);
    textAlign(CENTER);

    ellipse(fire.x, fire.y, 10);
    this.text("Move", width - 220 - 50, height - 225 + 60, 100, 100);
    this.text("Fire", 225 - 50, height - 225 + 60, 100, 100);
    pop()
    if (new MouseEvent("mousedown")) {

      fill(0, 200, 20, 150);
      if (mouseY > t.mpos.y - 50 && mouseY < t.mpos.y + 50 && mouseX > t.mpos.x - 50 && mouseX < t.mpos.x + 50) {

        t.mx = mouseX;
        t.my = mouseY;
        let d = dist(t.mx, t.my, t.mpos.x, t.mpos.y);

        var force = p5.Vector.fromAngle(d);
        t.heading += force;
        //  rotate(t.heading);

        while (Math.floor(t.heading) > 0) {
          G.ship[0].setRotation(0.1);
        }
        while (Math.floor(t.heading) < 0) {
          G.ship[0].setRotation(-0.1);
        }


        // console.log(this.heading);
        if ("mousePressed") {

          push()
          fill(200, 200, 20, 150);
          translate(t.mx, t.my);
        }
        ellipse(0, 0, 20)
        pop()
      }
      // var force = p5.Vector.fromAngle(this.heading)
      ellipse(move.x, move.y, 20)

    }







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
