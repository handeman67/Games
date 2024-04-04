class Dot {
    constructor(x, y, sp) {
        const t = this;
        if (!sp) {
            sp = 2.5;
        }
        t.pos = createVector(x, y);
        t.s = 25;
        t.sp = sp;
        t.w = width;
        t.h = height;
        t.ll = random(350);
        t.lw = random(100);
        t.cl = color(t.ll, 100, t.lw, 1);
        t.inc = [];
        t.inc.push("");
        t.hit = false;
    }
        show(){
            const t = this;
            ellipseMode();
            push();
            strokeWeight(5);
            stroke(50, 100, 100, 1);
            fill(t.cl);
            ellipse(t.pos.x, t.pos.y, t.s);
            noStroke(0);
            fill(50, 100, 100, 1);

            // ellipse(t.pos.x - t.s , t.pos.y + (t.s / 2.5), t.s / 3);
            // ellipse(t.pos.x + t.s , t.pos.y + (t.s / 2.5), t.s / 3);
            translate(t.pos.x, t.pos.y);
            pop();

        }
        move(){
            const t = this;
            t.pos.x = t.pos.x + t.sp;
            if (t.pos.x < 0 || t.pos.x > t.w - t.s) {
                t.drop();
            }
            // if{}
        }
        drop(){
            const t = this;
            t.sp = -t.sp;
            t.pos.y = t.pos.y + t.s;
            if (t.pos.y > t.h - t.s) {
                t.pos.y = t.s;
                //create kaos seperate circles
                t.pos.x = random(0, t.w);

            }
        }
        
        hits(inc){
            const t = this;
            //debugger
            var d = dist(t.pos.x, t.pos.y, inc.pos.x, inc.pos.y);
            if (d < t.s + inc.s) {
                console.log("inside",inc)
                return true;}}
    
}
Dts = function (speed) {
 let size=25,
 offset=5;

    for (var d = 0; d < 13; d++) {
       
        dots.push(new Dot(offset + size * d, 0, speed));
        document.getElementById('three').innerHTML = dots.length;
    }
};
dotsLoad = function () {
    for (let d of dots) {
        d.move();
        d.show();

        for (let l = lasers.length - 1; l > -1; l--) {
            if (dots.length === 0 || lasers.length === 0) {
                return;
            } else if (d.hit) {
                dots.splice(0, 1);
                lasers.splice(l, 1);
                GameScore += 10;
                if (dots.length <= 0) {
                    levelup();
                    this.speed++;
                    // Dts();
                }
                 
            }
           for (let m of mush ){
            d.hits(m);
            if(m.hit){
                mush.splice(m,1);
            }

           }
        
        }
    }
};
