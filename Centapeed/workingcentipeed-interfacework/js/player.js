class Player {
    constructor(x, y, r, a, spd) {
        const t = this;
        t.x = 100;
        t.y = height - 100;
        t.pos = createVector(this.x, this.y);

        t.r = r;
        t.heading = 0;
        t.rotation = 0;
        t.spd = spd;

        t.move = () => {
            if (keyIsDown(97)) {
                t.rotation.setRotation(-1);
                console.log('keyIsDown');
            } else if (keyIsDown(98)) {
                t.rotation.setRotation(1);
                console.log('keyIsDown');
            } else {
                t.rotation.setRotation(0);
                console.log('keyIsDown');
            }
            if (keyIsDown(37)) {
                t.pos.x -= this.spd;
                console.log('keyIsDown');
            }
            if (keyIsDown(39)) {
                t.pos.x += this.spd;
                console.log('keyIsDown');
            }
            if (keyIsDown(38)) {
                t.pos.y -= this.spd;
                console.log('keyIsDown');
            }
            if (keyIsDown(40)) {
                t.pos.y += this.spd;
                console.log('keyIsDown');
            }
            if (keyIsDown(99)) {
                t.heading = 0;
                console.log('keyIsDown');
            }

            function keyReleased(keyCode) {
                t.setRotation(0);
                console.log('keyIsDown');
                //this.heading=0;
            }

        };


        t.render = () => {
            let red = 100;
            let green = 255 - damg;
            let blue = 0 - damg;
            var damg = 50;
            push();
            translate(t.pos.x, t.pos.y);
            rotate(t.heading + PI / 2);
            t.shipFrame = stroke(0, 255, 255);
            fill(red, green, blue);
            triangle(-t.r, t.r, t.r, t.r, 0, -t.r - 10);
            pop();
            // console.log(lasers);
        };
        t.edges = () => {
            if (t.pos.x > width - t.r * 2) {
                t.pos.x = width - t.r * 2;
            } else if (t.pos.x < t.r * 2 + 5) {
                t.pos.x = t.r * 2 + 5;
            }
            if (t.pos.y > height - t.r * 2) {
                t.pos.y = height - t.r * 2;
            } else if (this.pos.y < height / 1.3) {
                t.pos.y = height / 1.3;
            }
        };
        t.inc = [];
        t.inc.push("");

        t.hits = (inc) => {
            var d = dist(t.pos.x, t.pos.y, inc.x, inc.y);
            if (d < t.r + inc.r) {
                console.log("dist  " + floor(d));
                player.fill(255, 0, 0);

                return true;
            }
        };
        t.setRotation = (a) => {
            t.rotation = a;
        };
        t.turn = () => {
            t.heading += t.rotation;
        };
    }
}