class Player {
  constructor(pos, SIZE, spd, a) {

    pos = createVector(0, 0);
    this.pos = pos;


    this.heading = 0;
    this.rotation = 0;
    this.spd = spd;

    this.move = () => {
      if (keyIsDown(97)) {
        this.setRotation(-1);
      } else if (keyIsDown(98)) {
        this.setRotation(1);
      } else {
        this.setRotation(0);
      }
      if (keyIsDown(37)) {
        this.pos.x -= this.spd;
      }
      if (keyIsDown(39)) {
        this.pos.x += this.spd;
      }
      if (keyIsDown(38)) {
        this.pos.y -= this.spd;
      }
      if (keyIsDown(40)) {
        this.pos.y += this.spd;
      }
      if (keyIsDown(99)) {
        this.heading = 0;
      }

      function keyReleased(keyCode) {
        this.setRotation(0);
        //this.heading=0;
      }

    };


    this.render = () => {
      var red = 100;
      var green = 255 - damg;
      var blue = 0 - damg;
      var damg = 50;
      push();
      translate(this.pos.x, this.pos.y);
      rotate(this.heading + PI / 2);
      this.shipFrame = stroke(0, 255, 255);
      fill(red, green, blue);
      triangle(-SIZE, SIZE, SIZE, SIZE, 0, -SIZE - 10);
      pop();
      // 
    };
    this.edges = () => {
      if (this.pos.x > width - SIZE * 2) {
        this.pos.x = width - SIZE * 2;
      } else if (this.pos.x < SIZE * 2 + 5) {
        this.pos.x = SIZE * 2 + 5;
      }
      if (this.pos.y > height - SIZE * 2) {
        this.pos.y = height - SIZE * 2;
      } else if (this.pos.y < height / 1.3) {
        this.pos.y = height / 1.3;
      }
    };
    this.inc = [];
    this.inc.push("");

    this.hits = (inc) => {
      var d = dist(this.pos.x, this.pos.y, inc.pos.x, inc.pos.y);
      if (d < SIZE + inc.SIZE) {

        player.fill(255, 0, 0);

        return true;
      }
    };
    this.setRotation = (a) => {
      this.rotation = a;
    };
    this.turn = () => {
      this.heading += this.rotation;
    };
  }
}
