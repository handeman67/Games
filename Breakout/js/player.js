
class Paddle extends Block{
   constructor(x,y,w,h,clr,blockcount)
   {
      super(x, y, w, h);
      !clr?this.clr=50:this.clr=clr;
      !x?this.x=vrs.center:this.x=x;
      !w?this.w=vrs.Size*2:this.w=w;
      !h?this.h=vrs.Size:this.h=h;
      !y?this.y=vrs.bottom:this.y=y;
      !blockcount?this.blockcount=`(${this.pos.y},${ this.pos.x})`:this.blockcount=blockcount;
      this.vel.sub(this.vel);
      this.mass=this.w*this.h/2;
     this.collide=false;
      }
      show_p(){
         noStroke();
         fill(this.clr);
         rect(this.pos.x ,this.pos.y,this.w,this.h, 10, 10, 10, 10);
         text(`paddel`, this.pos.x ,this.pos.y-vrs.Size*2);
      };
      playerBoundry(){
         console.log("playerBoundry")

      }
      update_p(){ 
         this.move();
      };
      move(){
         let e=this;


      if (keyIsDown(37)) {
        
         this.pos.x -= vrs.spd/2;
      
     }
      if (keyIsDown(39)) {
         this.pos.x += vrs.spd/2;
       
       }
   };
  
   hits(inc){
      let e = this;
      let d = dist(e.pos.x, e.pos.y, inc.pos.x, inc.pos.y);
      if(d<=100){
         console.log("onehundred");    
       boundry(e);
if(this.collide){
   console.log("collide");
   
}
 }     // if (gamebound.boundryleft&&d <= 108) 
      // { e.pos.x  = gamebound.boundryleft+vrs.Size;console.log("detecting left",this.boundry.left,"d",d);}
      //    //  e.pos.x -= (e.pos.x/2)* vrs.negative}
      //    if (gamebound.boundryright&&d <= 75) 
      //    {e.pos.x=gamebound.boundryright-vrs.Size;console.log("detecting right",this.boundry.right,"d",d);}
           
       
         
         
         
        
            
           
         //   if(bounces.length>3){
         //    console.log('bounces', d);
         //    bounces.splice(0,1);
         //   //  console.log('bounces', this.groundforce);
         //   }
      this.move();
      this.collide = false;
      this.bounce=false;
   };

}
