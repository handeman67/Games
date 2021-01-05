
class Paddle
{
   constructor(x, y)
   {
      this.spd = 5;
      this.w = 60;
      this.h = 10;
      this.pos = createVector(x, y);
      
      this.showp = () =>
      {
         noStroke();
         fill(0);
         rect(this.pos.x, this.pos.y + 10, this.w, this.h, 10, 10, 10, 10);
         this.text();
      };

      this.updatep = () =>
      {
         this.edges();
         this.move();
      };

   }

   text()
   {
      stroke(200, 100, 0);
      strokeWeight(2);
      textSize(20);
      text(this.pos.x, this.pos.x + this.w, this.pos.y - this.w, this.w, this.w);
   }

   move()
   {
      if (keyIsDown(37)) {
         this.pos.x -= this.spd;
     }
      if (keyIsDown(39)) {
         this.pos.x += this.spd;
       }
   }

   edges()
   {
      if (this.pos.x > innerWidth - this.w) {
         this.pos.x = innerWidth - this.w;
      }
      else if (this.pos.x < 0) {
         this.pos.x = 0;
      }
   }
}
