class Dot {
    constructor(x, y, sp) {
        const t = this;
        if (!sp) {
            sp = 2.5;
        }
        t.pos = createVector(x, y);
        t.s = 12.5;
        t.sp = sp;
        t.w = width;
        t.h = height;
        t.ll = random(350);
        t.lw = random(100);
        t.cl = color(t.ll, 100, t.lw, 1);

        t.hits = false;
        t.show = function() {
            ellipseMode();
            push();
            strokeWeight(5);
            stroke(50, 100, 100, 1);
            fill(t.cl);
            ellipse(t.pos.x, t.pos.y, t.s + 4);
            noStroke(0);
            fill(50, 100, 100, 1);

            ellipse(t.pos.x - t.s / 3, t.pos.y + (t.s / 2.5), t.s / 3);
            ellipse(t.pos.x + t.s + t.s / 3, t.pos.y + (t.s / 2.5), t.s / 3);
            translate(t.pos.x, t.pos.y);
            pop();

        };
        t.move = function() {
            t.pos.x = t.pos.x + t.sp;
            if (t.pos.x < 0 || t.pos.x > t.w - t.s) {
                t.drop();
            }
        };

        t.drop = function() {
            t.sp = -t.sp;
            t.pos.y = t.pos.y + t.s + 8;
            if (t.pos.y > t.h - t.s) {
                t.pos.y = t.s;
                //create kaos seperate circles
                t.pos.x = random(0, t.w);

            }
        };
        //


        t.inc = [];
        t.inc.push("");
        ///
        t.hits = function(inc) {
            //debugger
            var d = dist(t.pos.x, t.pos.y, inc.pos.x, inc.pos.y);
            if (d < t.s + inc.s) {
                return true;

            }
        };
    }
}
Dts = function(speed) {


    for (var d = 0; d < 5; d++) {
        dots.push(new Dot(25 + 12.5 * d, 0, speed));
        document.getElementById('three').innerHTML = dots.length;

    }
};
dotsLoad = function() {
    for (let d = 0; d < dots.length; d++) {
        if (dots.length === 0) {
            Dts();
        }

        dots[d].move();
        dots[d].show();
        for (let l = lasers.length - 1; l > -1; l--) {
            if (dots.length === 0 || lasers.length === 0) {
                return;
            } else
            if (dots[d].hits(lasers[l])) {

                lasers.splice(l, 1);
                dots.splice(d, 1);
                GameScore += 10;
                if (dots.length <= 0) {
                    levelup();
                    this.speed++;
                    console.log('Level Up');
                }
            }
        }
    }
};