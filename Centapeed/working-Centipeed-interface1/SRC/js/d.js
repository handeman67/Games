class Dot {
   constructor(x, y) {
         var t = this;
       
      t.pos = createVector(x, y);
      t.s =20;
      t.sp = 2.25;
      t.w = 400;
      t.h = 640;
      t.cl = color(275,50, 55,.7)
      t.hits = false
      function spec(){
        return strokeWeight(1),
        stroke(255, 255, 255),
          fill(t.cl, );      
      }
      function head(){  
 ellipse(t.pos.x, t.pos.y, t.s);
stroke(0);
strokeWeight(2);
line(t.pos.x+20, t.pos.y -random(5) , t.pos.x + 10, t.pos.y);

      }
      t.pos.y
      function bodybutton(){
         let x=t.pos.x-t.s/2;
         let y = t.pos.y+t.s/4;
         let size=t.s/2;
        
          return ellipse(x,y, size)
      }
      function bodypart(){return bodybutton(), spec(), head();}
      t.show = function () {let bp=bodypart()
      
      }
      t.move = function () {
         t.pos.x = t.pos.x - t.sp;
      
         if (t.pos.x <= 0|| t.pos.x >= t.w - t.s) {
            t.drop();
            
         }
      }

      t.drop = function () {
         t.sp = -t.sp;
         t.pos.y = t.pos.y + t.s+5;

         if (t.pos.y > t.h) {
            t.pos.y = 100;
            t.pos.x = random(0,t.w )
         }
      };
      //
      t.inc = [];
      t.inc.push("");
      ///
     t.hits= function(inc){
//debugger
         var d = dist(t.pos.x, t.pos.y, inc.pos.x, inc.pos.y);
         if (d < t.s + inc.s) {
               return true;

         }
      }
   }
}