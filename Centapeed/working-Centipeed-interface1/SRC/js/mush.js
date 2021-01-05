class Mush
{
   
   constructor(x,y, r)
   {

      
      this.pos=pos(x,y)
      this.r = r=15;
     // this.sp = 5;
      this.show = () =>
      {
         stroke(10, 255, 100, 255);
         strokeWeight(1);
         fill(100, 100, 100, 255);
         ellipse(this.pos.x, this.pos.y, this.r);
      };
      this.update=()=>{

         //this.r=this.r-1
      }
      ///hit detection
      this.inc = [];
      this.inc.push("");
      this.hits = (inc) =>
      {
         var d = dist(this.pos.x, this.pos.y, inc.pos.x, inc.pos.y);
         if (d < this.r + inc.r) {
            console.log("Mushroom hit");
            return true;
         }
      };
   }
}