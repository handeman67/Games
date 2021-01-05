class Player {

      constructor(spos, size, sp) {
            let t = this;
            t.pos = createVector(spos.x, spos.y);
            t.s = size = 20;
            t.sp = sp;
            t.cl = color(random(350), random(100), random(100),1)


            t.move = function ()
            {
                 let KD = keyIsDown
                  if (KD(37)) {
                        t.pos.x -= t.sp;
                  }
                  if (KD(39)) {
                        t.pos.x += t.sp;
                  }
                  if (KD(38)) {
                        t.pos.y -= t.sp;
                  }
                  if (KD(40)) {
                        t.pos.y += t.sp;
                  }


                  t.render = function () {
                        push();
                        ellipseMode(CENTER)
                        strokeWeight(2);
                        stroke(0, 255, 0);
                        fill(t.cl);
                        line(t.pos.x, t.pos.y, t.pos.x, t.pos.y - 20)
                        // triangle(t.pos.x, t.pos.y, -t.pos.x, -t.pos.y, t.pos.x, t.pos.y)
                        ellipse(t.pos.x, t.pos.y, t.s);
                        pop();
                  };
                  t.edges = function () {
                        let h3 = height / 1.3;
                        let w = width - t.s;
                        let h = height - t.s;
                        if (t.pos.x > w) {
                              t.pos.x = w;
                        } else if (t.pos.x < w - w + t.s) {
                              t.pos.x = w - w + t.s
                        }
                        if (t.pos.y > h) {
                              t.pos.y = h;
                        } else if (t.pos.y < h3) {
                              t.pos.y = h3;
                        }
                  };

                  //
                  t.inc = [];
                  t.inc.push("");
                  ///
                  t.hits = (inc) => {
                        var d = dist(t.pos.x, t.pos.y, inc.pos.x, inc.pos.y);
                        if (d < t.s  + inc.s) {
                              return true
                        }
                  }

            }
      }
}




////////////////////////////////////////////