class Ball {
    constructor(x, y, r) {
        let e = this;
        e.pos = createVector(x, y);
        e.vel = createVector(0, 0)
        e.acc = createVector(0, 1)
        e.width = r;
        e.mass = 10;
        e.inc = [];
        e.inc.push("");
        e.gravforce = (e.mass - e.inc.mass) * dist;
        e.heading = 0;
        e.force = p5.Vector.fromAngle(e.heading);
        e.mult = (a, b) => {
            if (!b) b = 2;
            return a * b
        }

        e.applyForce = function(force) {
                e.acc.add(force);
            }
            //(this.pos.x % this.vel.x )* (this.pos.y%this.vel.y);
        e.collide = false;


        //    this.collide.bounce();
        // this.collide.normal();
        e.updateb = (e) => {
            e = this;

            e.mult(e.acc);
            e.vel.add(e.heading);
            e.pos.add(e.vel);
            e.acc++
                if (e.pos.y > height || e.pos.y < 0) {
                    e.acc * -1
                    e.boost();
                }

        }

        e.showb = (e) => {
            e = this;
            fill(100, 100, 0);
            ellipse(100, 100, 50);
            stroke(200, 100, 0);
            strokeWeight(2);
            textSize(20);
            text(e.pos.x - e.pos.y, e.pos.y - e.width, e.width);



        };



        e.hits = (inc, e) => {
            e = this;
            var d = dist(e.pos.x, e.pos.y, e.inc.x, e.inc.y);
            if (d < inc.r) {
                console.log("true");
                boost();
                return true;
            } else {
                return false;
            }
        };
        e.edges = (e) => {

            e = this;
            if (e.pos.x > width - e.r) {
                e.pos.x = -e.r;
            } else if (e.pos.x < -e.r) {
                this.pos.x = width + e.r;
            }
            if (e.pos.y > height + e.r) {
                e.pos.y = -e.r;
            } else if (e.pos.y < -e.r) {
                e.pos.y = height + e.r;
            }
        };
        e.boost = (e) => {
            e = this;
            e.force = p5.Vector.fromAngle(e.heading);
            e.force.mult(0.5);
            e.vel.add(e.force);

        };

    }
}
let ball = new Ball()