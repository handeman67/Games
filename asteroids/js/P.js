
class Particles {
    constructor(pos, r) {
        let e = this;
        e.Ifparticleinput(pos, e, r);
        e.SetParticles(e);
        e.Updateparticle(e);
        e.Showparticle(e);
        e.Clearparticle(e);
    }

    Ifparticleinput(pos, e, r) {
        if (pos) {
            e.pos = pos.copy();
        } else {
            e.pos = createVector(0, 0);
        }
        if (r) {
            e.r = r;
        } else {
            e.r = random(2, 15);
        }
    }

    SetParticles(e) {
        e.vel = p5.Vector.random2D();
        e.force = floor(random(0, 50));
        e.vx = floor(random(sin(50), cos(120)));
        e.vy = floor(random(cos(150), sin(50)));
        e.col = random(255);
        e.alpha = 255;
        e.vl = e.vel + e.force;
        e.ran = floor(random(1, 8));
        e.offshape = floor(random(-e.r * 0.25, e.r * 0.25));
    }

    Clearparticle(e) {
        e.cleared = () => {
            if (e.alpha <= 0) {
                return;
            }
        };
    }

    Showparticle(e) {
        e.show = () => {
            push();
            stroke(200, e.alpha); //
            strokeWeight(random(10));
            fill(255, 0, 0, e.alpha); //
            e.Particleshape(e);
             pop();
        };
    }

    Particleshape(e) {
        beginShape();
        for (let i = 0; i < e.r; i++) {
            // vertex(e.pos.x, e.pos.y);
            // ellipse(e.pos.x, e.pos.y,e.r);
            point(e.pos.x, e.pos.y, e.r);
        }
        endShape(CLOSE);
    }

    Updateparticle(e) {
        e.update = () => {
            // e.pos.add(e.vel);
            e.pos.x += e.vx;
            e.pos.y += e.vy;
            e.alpha -= 4;
        };
    }
};
