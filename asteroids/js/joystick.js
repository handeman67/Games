<<<<<<< HEAD

class shapes {
   constructor(pos, r, c, w, h) {
      this.pos = createVector(width, height);
      this.r = 80;
      this.c = color(0, random(100, 255), random(100, 255), 20);
      this.h = 0;
      this.w = 0;
      this.clicked = function (x, y, px, py) {
         _.map(collection, iteratee);
         var d = dist(mouseX, mouseY, this.pos.x - this.r * 2.2, this.pos.y - 20);
         if (d < this.r) {
            return true;
            print(you, clicked1);
         }
         else {
            return false;
            print(no, click);
         }
      };
      this.showCoords = function (event) {
         var cX = event.clientX;
         var sX = event.screenX;
         var cY = event.clientY;
         var sY = event.screenY;
         var coords1 = "client - X: " + cX + ", Y coords: " + cY;
         var coords2 = "screen - X: " + sX + ", Y coords: " + sY;
         document.getElementById("demo").innerHTML = coords1 + "<br>" + coords2;
      };
      this.clickedL = function (x, y) {
         var d = dist(mouseX, mouseY, this.pos.x - this.pos.x + this.r * 2.2, this.pos.y - 20);
         if (d < this.pos.x) {
            return true;
            this.c = (0);
            print(you, clicked2);
         }
         else {
            return false;
            print(no, click);
         }
      };
      function paddles(pos, angle) {
         this.rightA = function () { beginShape().arc(this.pos.x - this.r * 2.2, this.pos.y - 20, this.r * 3, this.r * 3, PI, TWO_PI).endShape(); };
         this.leftA = function () { beginShape().arc(this.pos.x - this.pos.x + this.r * 2.2, this.pos.y - 20, 250, 250, PI, TWO_PI).endShape(); };
      }
      this.render = function () {
         //stroke(255, [100]);
         //strokeWeight(3);
         //fill(this.c);
         // beginShape();
         // triangle(25, 100, 100, 25, 25, 25);
         // endShape();
      };
   }
}
=======
function shapes(pos, r, c, w, h)
{
   this.pos = createVector(width, height);
   this.r = 80;
   this.c = color(0, random(100, 255), random(100, 255), 20);
   this.h = 0;
   this.w = 0;
      
   this.clicked = function (x, y,px,py)
   {
      _.map(collection, iteratee)
      var d = dist(mouseX, mouseY, this.pos.x - this.r * 2.2, this.pos.y - 20);
      if (d < this.r) {
         return true;
         print(you, clicked1)
      } else {
         return false;
         print(no, click)
         
      }
   }
   this.showCoords=function(event)
   {
      var cX = event.clientX;
      var sX = event.screenX;
      var cY = event.clientY;
      var sY = event.screenY;
      var coords1 = "client - X: " + cX + ", Y coords: " + cY;
      var coords2 = "screen - X: " + sX + ", Y coords: " + sY;
      document.getElementById("demo").innerHTML = coords1 + "<br>" + coords2;
   }
   this.clickedL = function (x, y)
   {
      
      var d = dist(mouseX, mouseY, this.pos.x - this.pos.x + this.r * 2.2, this.pos.y - 20);
      if (d < this.pos.x) {
         return true;
         this.c = (0);
         print(you, clicked2)
      } else {
         return false;
         print(no, click)
      
      }
   }
   function paddles(pos, angle)
   {
      
      this.rightA = function () { beginShape().arc(this.pos.x - this.r * 2.2, this.pos.y - 20, this.r * 3, this.r * 3, PI, TWO_PI).endShape() };
      this.leftA = function () { beginShape().arc(this.pos.x - this.pos.x + this.r * 2.2, this.pos.y - 20, 250, 250, PI, TWO_PI).endShape() };
   }
      
   this.render = function ()
   {
      //stroke(255, [100]);
      //strokeWeight(3);
      //fill(this.c);
      // beginShape();
      // triangle(25, 100, 100, 25, 25, 25);
      // endShape();
      
      
   }
}
>>>>>>> 6e63db0a0b5a0b2aebb08a2ab60a835bbb8dfd3c
