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

const TYPE = ["BARRIER", "BISCUIT", "OPEN", "OPEN1", "OPEN2", "CHERRY", "CHERRY"],
    SIZE = 25,
    THIRD_SIZE = SIZE / 3,
    HALF_SIZE = SIZE / 2,
    QUARTER_SIZE = SIZE / 4,
    offset = 8;


class Tile {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.w = SIZE;
        this.h = SIZE;
        this.type = type;
        this.hit = false;
        //console.log(type[2])   
    }
    show() {
        let i = 0;
        const t = this;
        switch (t.type) {
            case 0:
                ellipseMode(CORNER);
                // t.barrier1 = function() {
                //     push();
                //     stroke(5);
                //     strokeWeight(2);
                //     noFill();
                //     // rect(t.x * SIZE, t.y * SIZE, SIZE, SIZE);
                //     // textAlign(CENTER)
                //     // textSize(20)
                //     text("A", t.x * SIZE+offset, t.y * SIZE+8, 25, 25)
                //     i++;
                //     pop();

                // };
                // t.barrier1();
                break;
            case 1:
                // push();
                // stroke(255, 0, 0);
                // ellipse(t.x * SIZE + THIRD_SIZE, t.y * SIZE + THIRD_SIZE, THIRD_SIZE);
                // pop();
                break;
            case 2:
                // push();
                // textAlign(CENTER);
                // textSize(20);
                // stroke(255, 100, 100);
                // text("B", t.x * SIZE + offset, t.y * SIZE + offset, 25, 25);
                // pop();
                break;
            case 3:
                // push();
                // textAlign(CENTER);
                // textSize(20);
                // stroke(0, 100, 100);
                // text("A", t.x * SIZE + offset, t.y * SIZE + offset, 25, 25);
                // pop();
                break;
            case 4:

                rect(t.x * SIZE, t.y * SIZE, SIZE, SIZE);


                break;
            case 5:



                // t.pos = createVector(t.x, t.y);
                // ellipseMode(CORNER);
                // // rect(t.x * SIZE, t.y * SIZE, SIZE, SIZE);
                // fill(355, 80, 80, 255);
                // state((line(t.x * SIZE + SIZE, t.y * SIZE + SIZE, t.x * SIZE, t.y * SIZE)));
                // noStroke();
                // fill(0, 100, 100);
                // state(ellipse(t.x * SIZE + QUARTER_SIZE, t.y * SIZE + QUARTER_SIZE, HALF_SIZE));
                // stroke(0);
                // strokeWeight(5);

                // state(point(t.x * SIZE + HALF_SIZE, t.y * SIZE + HALF_SIZE));
                // pop();
                // for (let d = 0; d > dots.length; d++) {
                //       if (t.cherry.hits(dots[d])) {
                //             console.log("hit Cherry")
                //       }
                // }

                plantMushroom(t.x * SIZE, t.y * SIZE, SIZE);



                break;


            case 6:
                // plantMushroom(t.x * SIZE, t.y * SIZE, SIZE);
              
                break;
        }


    }

}
function plantMushroom(a,b,c){
  if (mush.length >= 100) {
                    mush.splice(0, 1);
                }
                mush.push(new Mush(a,b,c));
}

class Mush {

    constructor(x, y, r) {
        const t = this;
        t.pos = createVector(x, y);
        t.r = r = 25;
        // this.sp = 5;
        t.inc = [];
        t.inc.push("");
        t.hit=false;

    }
    show() {
        const t = this;
        push()
        stroke(10, 255, 100, 255);
        strokeWeight(1);
        fill(100, 100, 100, 255);
        ellipse(t.pos.x, t.pos.y, t.r);
        //  line(t.x * SIZE + SIZE, t.y * SIZE + SIZE, t.x * SIZE, t.y * SIZE);
        //  line(t.x * SIZE + SIZE, t.y * SIZE, t.x * SIZE, t.y * SIZE + SIZE);
        pop();
    }
    update() {
        const t = this;
        this.r = this.r * -1;
    }
    ///hit detection

    hits(inc) {
        const t = this;
        var d = dist(t.pos.x, t.pos.y, inc.pos.x, inc.pos.y);
        if (d < t.r + inc.r) {
            console.log("Mushroom hit");
            return true;
        }
    }
}
function state(a, b) {
    push();
    b;
    stroke(255, 0, 0);
    strokeWeight(15);
    noFill();
    // rect(t.x * SIZE, t.y * SIZE, SIZE, SIZE);
    fill(255, 100, 0);
    stroke(120, 0, 0);
    a;
    pop();

}
const can =document.getElementById("can2");
let wth;
if(can !== null){
wth=can.clientWidth;
console.log("here i am ",wth);
}
 
function loadField() {
    field = [];

    for (var f = 0; f < wth; f++) {
        num = floor(random(0, 7));
        FIELD.push(num);
    }
    //distribute field with Tiles using FIELD
    for (var i = 0; i < FIELD.length; i++) {
        var row = FIELD[i];
        field.push(new Tile(i % 25, Math.floor(i / 25), row));

    }

}

function MushLoad() {
    for (let m of mush) {
        m.update();
        m.show();

        for (let d = dots.length - 1; d >= 0; d--) {

            if (dots.length === 0 || lasers.length === 0) {
                return;
            } else
            if (dots[d].hits(m)) {
                console.log("Mushroom hit", m);
            }
            for (let l = lasers.length - 1; l > -1; l--) {
                if (m.length <= 0 || lasers.length === 0) {
                    console.log("mush gone");
                    return;
                }

                if (m.hits(lasers[l])) {

                    lasers.splice(l, 1);
                    mush.splice(m, 1);
                }
            }
        }
    }
}
