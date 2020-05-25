class Asteroid {

  constructor(pos, r) {
    let e = this;
    this.AstSetup(e, pos, r);
  }
  AstSetup(e, pos, r) {
    e.Setpos(pos, e);
    e.Setsize(r, e);
    e.Setvelocity(e);
    e.Setvertisies(e);
    e.Astupdate(e);
    e.Astrender(e);
    e.Astparticles(e);
    e.Astbreakup(e);
    e.Astedges(e);
  }

  Astupdate(e) {
    e.update = function () {
      e.pos.add(e.vel);
    };
  }

  Astedges(e) {
    e.edges = function () {
      if (e.pos.x > width + e.r) {
        e.pos.x = -e.r;
      } else if (e.pos.x < -e.r) {
        e.pos.x = width + e.r;
      }
      if (e.pos.y > height + e.r) {
        e.pos.y = -e.r;
      } else if (e.pos.y < -e.r) {
        e.pos.y = height + e.r;
      }
    };
  }

  Astbreakup(e) {
    e.breakup = function (newA) {
      sm.play();
      bm.play();
      var newA = [];
      for (var j = 0; j < random(4); j++) {
        newA.push(new Asteroid(e.pos, e.r));
        score += 5;
      }
      return newA;
    };
  }

  Astparticles(e) {
    e.pts = function () {
      push();
      parts = [];
      for (let i = 0; i < e.r; i++) {
        parts.push(new Particles(e.pos));
      }
      pop();
      return parts;
    };
  }

  Astrender(e) {
    e.render = function () {
      push();
      stroke(255);
      strokeWeight(2);
      fill(100, 100, 100, 125);
      translate(e.pos.x, e.pos.y);
      beginShape();
      for (var i = 0; i < e.total; i++) {
        var angle = map(i, 0, e.total, 0, TWO_PI);
        var r = e.r + e.offset[i];
        var x = r * cos(angle);
        var y = r * sin(angle);
        vertex(x, y);
      }
      endShape(CLOSE);
      pop();
    };
  }

  Setvertisies(e) {
    e.total = floor(random(10, 20));
    //offset of verticies
    e.offset = [];
    for (var i = 0; i < e.total; i++) {
      e.offset[i] = random(-e.r * 0.25, e.r * 0.25);
    }
  }

  Setvelocity(e) {
    e.vel = p5.Vector.random2D();
  }

  Setsize(r, e) {
    if (r) {
      e.r = r * 0.5;
    } else {
      e.r = random(random(10, 20), (60, 80));
    }
  }

  Setpos(pos, e) {
    if (pos) {
      e.pos = pos.copy();
    } else {
      e.pos = createVector(random(width), random(height));
    }
  }
}