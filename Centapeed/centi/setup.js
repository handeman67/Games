const w=innerWidth-30;
const h=innerHeight-30;
const size=30;

function setup(){
createCanvas(w, h, '2d');
background(0);

 bodyPart=(A)=>{
   if (!A) A=0;
   let part=[];
   let parts=5;
   
    stroke(255);
    let Fill=(num)=>{
      colors=[];
      let r =num;
          let ran=Math.random();
          let R=ran*r;
          let G=ran*r;
          let B=ran*r;
     let Clr=(R,G,B);
     colors.push(Clr);
      
      return random(colors);
    };
  fill(Fill(10),Fill(100),Fill(200));
   for(let c=0;c<parts;c++){
       let Part=(Ax,Ay)=>{
 if(!Ax)Ax=A;
 if(!Ay)Ay=A;
ellipse(Ax+size*c,Ay, w/size);

return this;
};
part.push(Part());

   }
 
  };


  let move = () => {
    Ax = Ax += sp;
    if (Ax < 0 + this.r || this.pos.x > width - this.r) {
      this.drop();

    }
  };

  this.drop = () => {
    this.pos.y = this.r + this.pos.y;
    this.sp = -this.sp;
    if (this.pos.y > height - this.r) {
      if (this.dt >= dot.length) {
        level++;
      }
      
      this.pos.y = 100;
      this.pos.x = width / 2;

    }
  };
}
function draw(){
 

 bodyPart(50);
 
}