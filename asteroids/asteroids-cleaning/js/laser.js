class   Laser {
    constructor(spos, angle) {

        this.pos = createVector(spos.x, spos.y);
        this.vel = p5.Vector.fromAngle(angle);
        this.vel.mult(10);
 }
        update = function () {
            this.pos.add(this.vel);
        };

    render = function () {
            push();
            stroke(255);
            strokeWeight(4);
            ellipse(this.pos.x, this.pos.y, 2);
            //point(this.pos.x, this.pos.y);
            //rect(this.pos.x, this.pos.y, 10, 5,2)
            pop();

        };

        hits = function (asteroid) {
            var d = dist(this.pos.x, this.pos.y, G.asteroid.pos.x, G.asteroid.pos.y);
            if (d < G.asteroid.r) {
                return true;
            } else {
                return false;
            }
        };





        offscreen = function () {
            if (this.pos.x > width || this.pos.x < 0) {
                return true;
            }
            if (this.pos.y > height || this.pos.y < 0) {
                return true;
            }

        };


   
}

    
