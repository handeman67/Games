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
    show() {

        var t = this;
        switch (t.type) {
            case 0:
                t.barrier1 = function() {
                    push();
                    stroke(50, 10);
                    strokeWeight(1);
                    noFill();
                    rect(t.x * SIZE, t.y * SIZE, SIZE, SIZE);
                    // textAlign(CENTER)
                    // textSize(20)
                    // let i=0
                    // text(i, t.x * SIZE, t.y * SIZE, 30, 30)
                    // i++
                    pop();
                }
                t.barrier1()
                break;
            case 1:
                t.barrier = function() {
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
                t.medium = function() {
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
                t.light = function() {
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

                t.dark = function() {

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


                // mush.push(new Mush(t.x * SIZE , t.y * SIZE, SIZE));
                t.cherry = function(x, y) {
                    t.pos = createVector(t.x, t.y)
                    ellipseMode(CORNER);
                    push();
                    stroke(50, 10);
                    noFill();
                    strokeWeight(1);
                    rect(t.x * SIZE, t.y * SIZE, SIZE, SIZE);
                    fill(355, 80, 80, 255);
                    pop();
                    stroke(0)
                    strokeWeight(2)
                    line(t.x * SIZE + SIZE, t.y * SIZE + SIZE, t.x * SIZE, t.y * SIZE);
                    line(t.x * SIZE + SIZE, t.y * SIZE, t.x * SIZE, t.y * SIZE + SIZE);

                    pop();
                    noStroke();
                    fill(0, 100, 100)
                    ellipse(t.x * SIZE + QUARTER_SIZE, t.y * SIZE + QUARTER_SIZE, HALF_SIZE);
                    stroke(0)
                    strokeWeight(5)
                    point(t.x * SIZE + HALF_SIZE, t.y * SIZE + HALF_SIZE)
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
                    // for (let d = 0; d > dots.length; d++) {
                    //       if (t.cherry.hits(dots[d])) {
                    //             console.log("hit Cherry")
                    //       }
                    // }





                break;


            case 6:

                class Mush {

                    constructor(x, y, r) {
                        const t = this;
                        t.pos = createVector(x, y);
                        t.r = r = 15;
                        // this.sp = 5;
                        t.show = () => {
                            stroke(10, 255, 100, 255);
                            strokeWeight(1);
                            fill(100, 100, 100, 255);
                            ellipse(t.pos.x, t.pos.y, t.r);
                            //  stroke(0)
                            //  strokeWeight(2)
                            //  line(t.x * SIZE + SIZE, t.y * SIZE + SIZE, t.x * SIZE, t.y * SIZE);
                            //  line(t.x * SIZE + SIZE, t.y * SIZE, t.x * SIZE, t.y * SIZE + SIZE);
                        };
                        // t.update=()=>{

                        //    this.r=this.r*-1
                        // }
                        ///hit detection
                        t.inc = [];
                        t.inc.push("");
                        t.hits = (inc) => {
                            var d = dist(t.pos.x, t.pos.y, inc.pos.x, inc.pos.y);
                            if (d < t.r + inc.r) {
                                console.log("Mushroom hit");
                                return true;
                            }
                        };
                    }
                }
                if (mush.length >= 100) { mush.splice(0, 1) }
                mush.push(new Mush(t.x * SIZE, t.y * SIZE, SIZE))


                break;
        }


    }

}

function loadField() {
    field = []
    for (var f = 0; f < 500; f++) {
        num = floor(random(0, 7))
        FIELD.push(num)
    }
    //distribute field with Tiles using FIELD
    for (var i = 0; i < FIELD.length; i++) {
        var row = FIELD[i];
        field.push(new Tile(i % 25, Math.floor(i / 25), row))

    }
}
MushLoad = function() {
    for (m in mush) {
        // mush[m].update();
        mush[m].show();
        for (let d = dots.length - 1; d >= 0; d--)

            if (mush[m].hits(dots[d])) {
                console.log("Mushroom hit");
            }
        for (let l = lasers.length - 1; l > -1; l--) {
            if (dots.length === 0 || lasers.length === 0) {
                return
            };
            if (mush[m].hits(lasers[l])) {

                lasers.splice(l, 1)
                mush.splice(d, 1);
            }
        }
    }
}