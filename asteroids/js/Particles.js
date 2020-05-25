var NAME = ['Rich'];
var Grid=[];
function Particle1(pos, r, ac, force, valocity)
{

      // function reverse(str)
      // {
      //       var rtnStr = [];
      //       for (var i = str.length - 1; i >= 0; i--) {
      //             rtnStr += str[i];
      //       }
      //       return rtnStr;
      // }
     


   let speed = .01;
   let startX = 0;
      let startY = 0;
      let angle = 0;   
   let h = Math.random()*innerHeight;
   let w = Math.random()*innerWidth;
   if (force) { this.force = createVector(0, 0.05); }
   if (valocity) {
      this.valocity = createVector(random(-1, 1), random(-1, 0));
   }
   if (pos) {
      this.pos = pos.copy();
   } else {
      this.pos = createVector(startX+w, startY+h )
   }
   
   if (r) {
      this.r = r * .5;
   } 
   if (particles[0]) {
            this.ac = this.render;
      }

   this.vel = p5.Vector.random2D();
   //this.total = floor(random(5, 20));
   //this.offset = [];
 
   this.update = function ()
   {
        
         this.pos.add(this.vel);
   
      }
      
      this.inc = [];
      this.inc.push('');

      this.hits = function (inc)
      {
            var d = dist(this.pos.x, this.pos.y, inc.pos.x, inc.pos.y);
            if (d < this.r + inc.r) {
                  return true;
            }
            
      }
   this.render = function ()
   {
        
         push();
         stroke(0, 255, 10);
         strokeWeight(1);   
         fill(100); 
         
         textSize(30);
         text(NAME, this.pos.x, this.pos.y);
         //rotateX(this.offset[i])
        // clock(this.pos.x, this.pos.y);
        
      // stroke(255);
       //fill(200); ellipse(this.pos.x, this.pos.y, 20);
       //rect(this.pos.x, this.pos.y, width / 2, height / 2, 10, 10, 50, 50);
         
        // point(this.pos.x, this.pos.y);
      pop();
   }

      // this.hits = function (particles)
      // {
      //       var d = dist(this.pos.x, this.pos.y, particles.pos.x, particles.pos.y);
      //       //
      //       if (d < particles.r) {
      //             return true;

      //       } else {
      //             return false;
      //       }

      
      
   this.breakup = function ()
   {
         //sm.play()
         var newA = [];
         newA[0] = new Particle1(this.pos, this.r);
         newA[1] = new Particle1(this.pos, this.r);
         return newA;
   }
   this.edges = function ()
   {
      if (this.pos.x > width + this.r) {
         this.pos.x = -this.r;
      } else if (this.pos.x < -this.r) {
         this.pos.x = width + this.r;
      }
      if (this.pos.y > height + this.r) {
         this.pos.y = -this.r;
      } else if (this.pos.y < -this.r) {
         this.pos.y = height + this.r;
      }
      }
   
//       this.forceShield = function ()
//       {
//             for (var i = 0; i < particles.length; i++) {
//                   if (particles[i].hits(particles[i])) {
//                         particles.splice(i, 1);
// }
//                         // ss.play();



    



//                   }
//             }
      }


const zvalue=1;
function createVector(x,y,z){
  const X=innerWidth;
   const Y= innerHeight;
   var Z =X*zvalue
   for(let h =0;h<X.length-1;h++){
   for(let i =0;i<Y.length-1;i++){
   for(let j =0;j<Z.length-1;j++){
     



}
}
}
Grid.push((x*y)+(x*z)*y)
}
Grid

