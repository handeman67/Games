class Tile {
      constructor(x, y, type) {
            if (!x) x = 0;
            if (!y) y = 0;
            this.pos = createVector(x, y);
            this.x = this.pos.x;
            this.y = this.pos.y;
            this.type = type;
      this.hit=false
            //console.log(type[2])   
      }
      draw() {

            var t = this;
            var s = SIZE;
            switch (t.type) {
                  case 0:
                        t.barrier1 = function () {
                              push();
                              stroke(50, 10);
                              strokeWeight(1);
                              fill(10, 100, 100, 0.5);
                              image(sleep, t.x * s, t.y * s, s, s)
                              //  rect(t.x * s, t.y * s, s, s);
                              pop();
                        }
                        t.barrier1()
                        break;
                  case 1:
                        t.barrier = function () {
                              push();
                              noFill();
                              image(mushroom, t.x * s, t.y * s, s, s);
                              pop();
                              t.inc = [];
                              t.inc.push("");
                              ///
                              t.hits = (inc) => {
                                    var d = dist(t.x, t.y, inc.pos.x, inc.pos.y);
                                    if (d < t.s + inc.s) {
                                          consoloe.log('hit');
                                          return true
                                    }
                              }
                        }

                        t.barrier()

                        break;
                  case 2:
                        t.medium = function () {
                              push();
                              fill(100, 100, 255);
                              image(grass1, t.x * s, t.y * s, s, s)

                              pop();
                        }
                        t.medium();
                        break;
                  case 3:
                        t.light = function () {
                              push();
                              fill(10, 100, 100);
                              image(grass3, t.x * s, t.y * s, s, s)
                              pop();
                        }
                        t.light();
                        break;
                  case 4:

                        t.dark = function () {
                              push();
                              noFill(255);
                              image(grass, t.x * s, t.y * s, s, s)
                              pop();
                        }
                        t.dark();
                        break;
                  case 5:

                        t.cherry = function () {
                              push();
                              stroke(50, 10);
                              noFill();
                              strokeWeight(1);
                              rect(t.x * s, t.y * s, s, s);
                              image(mushroom2, t.x * s, t.y * s, s, s)
                              pop();



                              t.inc = [];
                              t.inc.push("");
                              ///
                              t.hits = (inc) => {
                                    var d = dist(t.pos.x, t.pos.y, inc.pos.x, inc.pos.y);
                                    if (d < t.s + inc.s) {
                                          return true
                                    }
                              }

                        }

                        t.cherry();
                        for (let d = 0; d > dot.length; d++) {
                              if (t.cherry.hits(dot[d])) {
                                    console.log("hit Cherry")
                              }
                        }

                        break;


                  case 6:

                  t.cherry1 = function () {
                             
                              noStroke("255,255,255,200");
                              // strokeWeight(1);
                              fill(0, 90, 80);

                              image(mushroom2, t.x * s, t.y * s, s, s);
                              t.inc = [];
                              t.inc.push("");
                              ///
                              t.hits = (inc) => {
                                    var d = dist(t.x, t.y, inc.pos.x, inc.pos.y);
                                    if (d < t.s + inc.s) {
                                          return true
                                    }
                              }

                        }

                        t.cherry1();

                        for (let d = 0; d > dot.length; d++) {
                              if (t.cherry1.hits(dot[d])) {
                                    console.log("hit Cherry")
                              }
                        }

                        break;
            }
            //hithere

      }

}
