var FIELD = [];
// 3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,
// 3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,
// 2,0,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,0,2,
// 3,2,2,0,0,2,0,0,0,2,0,2,0,0,2,0,0,0,0,2,
// 3,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,
// 3,2,0,2,0,2,0,0,2,0,2,2,2,0,0,2,0,0,2,2,
// 3,0,2,2,0,2,0,0,3,3,3,3,2,2,2,2,2,3,0,2,
// 3,0,0,2,0,2,0,2,0,0,0,2,0,2,0,2,0,2,2,2,
// 3,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,
// 3,0,3,0,0,0,0,0,0,2,2,0,2,0,0,0,0,0,2,2,
// 0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,2,
// 3,0,0,0,3,0,2,2,2,2,0,2,2,0,0,0,3,0,0,2,
// 3,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,2,
// 3,0,0,2,0,0,2,2,2,2,0,2,2,0,2,2,0,0,0,2,
// 3,0,0,2,0,0,2,2,2,2,2,0,2,0,2,0,2,0,0,2,
// 3,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,2,
// 3,0,2,2,2,2,0,0,0,0,0,3,2,0,0,0,2,2,0,2,
// 3,0,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,2,
// 3,2,3,0,0,0,2,2,0,2,0,0,0,0,0,0,0,0,2,2,
// 0,3,3,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,2

// 

var TYPE = ["BARRIER", "BISCUIT", "OPEN", "OPEN1", "OPEN2", "CHERRY", "CHERRY"];
var SIZE = 25;
var THIRD_SIZE = SIZE / 3;
var HALF_SIZE = SIZE / 2
var QUARTER_SIZE = SIZE / 4


class Tile {
      constructor(x, y, type) {
            this.x = x;
            this.y = y;
            this.type = type;
            //console.log(type[2])   
      }
      draw() {

            var t = this;
            switch (t.type) {
                  case 0:
                        t.barrier1 = function () {
                               push();
                               stroke(50, 10);
                              strokeWeight(1);
                              noFill();
                               rect(t.x * SIZE, t.y * SIZE, SIZE, SIZE);
                               pop();
                        }
                        t.barrier1()
                        break;
                  case 1:
                        t.barrier = function () {
                              push();
                              stroke(50, 10);
                              strokeWeight(1);
                              noFill();
                              rect(t.x * SIZE, t.y * SIZE, SIZE, SIZE);
                              pop();
                              //ellipse(t.x * SIZE + THIRD_SIZE, t.y * SIZE + THIRD_SIZE, THIRD_SIZE);
                        }
                        t.barrier()
                        break;
                  case 2:
                        t.medium = function () {
                              push();
                              stroke(50, 10);
                              strokeWeight(1);
                              noFill();
                              rect(t.x * SIZE, t.y * SIZE, SIZE, SIZE);
                              pop();
                        }
                        t.medium();
                        break;
                  case 3:
                        t.light = function () {
                               push();
                               stroke(50, 10);
                              strokeWeight(1);
                              noFill();
                               rect(t.x * SIZE, t.y * SIZE, SIZE, SIZE);
                               pop();
                        }
                        t.light();
                        break;
                  case 4:

                        t.dark = function () {

                               push();
                               stroke(50, 10);
                              strokeWeight(1);
                              noFill();
                               rect(t.x * SIZE, t.y * SIZE, SIZE, SIZE);
                               pop();
                        }
                        t.dark();
                        break;
                  case 5:
                  
                        t.cherry = function (x, y) {
                              t.pos = createVector(t.x,t.y)
                              ellipseMode(CORNER);
                              push();
                              stroke(50, 10); 
                              noFill();
                              strokeWeight(1);
                              rect(t.x * SIZE, t.y * SIZE, SIZE, SIZE);
                              fill(355, 80, 80, 255);
                              pop();
                              push();
                              stroke(0);
                              strokeWeight(2);
                              line(t.x * SIZE + SIZE, t.y * SIZE + SIZE, t.x * SIZE, t.y * SIZE);
                              line(t.x * SIZE + SIZE, t.y * SIZE, t.x * SIZE, t.y * SIZE + SIZE);
                              
                              pop();
                              push();
                              noStroke();
                              fill(0,100,100);
                              ellipse(t.x * SIZE + QUARTER_SIZE, t.y * SIZE + QUARTER_SIZE, HALF_SIZE);
                              stroke(0);
                              strokeWeight(5);
                              point(t.x * SIZE + HALF_SIZE, t.y * SIZE + HALF_SIZE);
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

                        t.cherry()
                        for (let d = 0; d > dots.length; d++) {
                              if (t.cherry.hits(dots[d])) {
                                    console.log("hit Cherry")
                              }
                        }

                        break;


                  case 6:

                        // t.cherry = function (x, y) {
                        //       t.pos = createVector(x, y)
                        //       ellipseMode(CORNER);
                        //       noStroke("255,255,255,200");
                        //       // strokeWeight(1);
                        //       fill(0, 90, 80);
                        //        rect(t.x * SIZE, t.y * SIZE, SIZE, SIZE);
                        //       ellipse(t.x * SIZE + QUARTER_SIZE, t.y * SIZE + QUARTER_SIZE, HALF_SIZE);
                        //       t.inc = [];
                        //       t.inc.push("");
                        //       ///
                        //       t.hits = (inc) => {
                        //             var d = dist(t.x, t.y, inc.pos.x, inc.pos.y);
                        //             if (d < t.s + inc.s) {
                        //                   return true
                        //             }
                        //       }

                        // }

                        // t.cherry()
                        // for (let d = 0; d > dots.length; d++) {
                        //       if (t.cherry.hits(dots[d])) {
                        //             console.log("hit Cherry")
                        //       }
                        // }

                        break;
            }


      }

}