<<<<<<< HEAD
function Parts(pos,vel)
{
  this.pos = pos.copy();
    this.vel = vel.copy();
   this.vel.add(p5.Vector.random2D().mult(random(0.5, 1.5)));
   this.transparency = random(20, 50);

   this.update = function ()
   {
      this.pos.add(this.vel);
      this.transparency -= .2;
   }



   this.render = function ()
   {
      if (this.transparency > 0) {
         push();
         fill(random(100, 200))
         stroke(this.transparency); //this.transparency
         strokeWeight(random(1, 5))
         //fill(255);
         point(this.pos.x, this.pos.y);
         //rect(this.pos.x, this.pos.y, this.r, this.r, [-10], [-10], [-10], [-10])
         //ellipse(this.pos.x, this.pos.y, 5, 5)
         pop();
      }
   }
}

function addparts(pos, vel, n)
{

   for (var i = 0; i < n; i++) {
      parts.push(new Parts(this.pos,this.vel));
     
   }



}//////////////////////////////////////////////////

=======
function Parts(pos,vel)
{
  this.pos = pos.copy();
    this.vel = vel.copy();
   this.vel.add(p5.Vector.random2D().mult(random(0.5, 1.5)));
   this.transparency = random(20, 50);

   this.update = function ()
   {
      this.pos.add(this.vel);
      this.transparency -= .2;
   }



   this.render = function ()
   {
      if (this.transparency > 0) {
         push();
         fill(random(100, 200))
         stroke(this.transparency); //this.transparency
         strokeWeight(random(1, 5))
         //fill(255);
         point(this.pos.x, this.pos.y);
         //rect(this.pos.x, this.pos.y, this.r, this.r, [-10], [-10], [-10], [-10])
         //ellipse(this.pos.x, this.pos.y, 5, 5)
         pop();
      }
   }
}

function addparts(pos, vel, n)
{

   for (var i = 0; i < n; i++) {
      parts.push(new Parts(this.pos,this.vel));
     
   }



}//////////////////////////////////////////////////

>>>>>>> 9d933a718cd310636e7bf4dc82eeaa36319d80f0
