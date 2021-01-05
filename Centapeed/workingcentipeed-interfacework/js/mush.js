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


Msh = function() {

    let r = 25;
    for (var m = 0; m < 1; m++) {
        mush.push(new Mush(this.x, this.y, r))
    }
}