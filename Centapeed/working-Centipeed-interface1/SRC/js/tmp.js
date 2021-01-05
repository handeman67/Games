 bloc = function(x, y, size)
{
  this.x = x;
  this.y = y;
  this.size = size;
  // this.hit = function(){
    
  // }
  this.show = function ()
  {
    strokeWeight(2);
    stroke(255, 255, 0);
    fill(255, 255, 0);
    ellipse(this.x, this.y, this.size);
  }
  this.update = function (){
    
  }
};

function bit(spos, angle)
{
  
  this.pos = createVector(spos.x, spos.y);
  this.vel = p5.Vector.fromAngle(angle);
  this.vel.mult(10);

  this.update = function ()
  {
    this.pos.x.add(this.vel);
  };

  this.render = function ()
  {
    push();
    stroke(255);
    strokeWeight(4);
    ellipse(this.pos.x, this.pos.y, 2);
    //point(this.pos.x, this.pos.y);
    //rect(this.pos.x, this.pos.y, 10, 5,2)
    pop();
  };

  this.hits = function (dots)
  {
    var d = dist(this.pos.x, this.pos.y, dots.pos.x, dots.pos.y);
    if (d < dots.size) {
      return true;
    } else {
      return false;
    }
  }
}