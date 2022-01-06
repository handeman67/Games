function shapes(x,y,r, c, w, h){             
    !r?this.r = 80:()=>{ this.r = r; return this.r;};
    !c?this.c = color(0, random(100, 255), random(100, 255), 20):()=>{ this.c = c; return this.c;};
    !h?this.h = 0:()=>{ this.h = h; return this.h;};
    !w?this.w = 0:()=>{ this.w = w; return this.w;};
    !x?this.x = 0:()=>{ this.x = x; return this.x;};
    !y?this.y = 0:()=>{ this.y = y; return this.y;};
    this.pos = createVector(this.x, this.y);
   
   this.clicked=()=>{
     
      let clik=()=>{ var d = dist(mouseX, mouseY, this.pos.x - this.r * 2.2, this.pos.y - 20);
       if (d < this.r) {
     
         clik();
          print('you', 'clicked1');
          return true;
       
       } else {
          return false;
          
          
       }};
        document.addEventListener('clicked', clik);
    };
    
    

    this.showCoords=(event)=>
    {
       var cX = event.clientX;
       var sX = event.screenX;
       var cY = event.clientY;
       var sY = event.screenY;
       var coords1 = "client - X: " + cX + ", Y coords: " + cY;
       var coords2 = "screen - X: " + sX + ", Y coords: " + sY;
       document.getElementById("demo").innerHTML = coords1 + "<br>" + coords2;
    };
document.addEventListener('mousemove', this.showCoords);


    this.clickedL=(x, y)=>{
       
       var d = dist(mouseX, mouseY, this.pos.x - this.pos.x + this.r * 2.2, this.pos.y - 20);
       if (d < this.pos.x) {
          this.c = (0);
          print('you', 'clicked2');
 
          return true;
         
       } else {
           
          return false;
         
       
       }
    };
document.addEventListener('click', this.clickedL);


    this.paddles=(x,y, angle)=>{
       let pos=createVector(0,0);
       pos.x=x;
       pos.y=y;
       this.angle=angle;
       stroke(255);
       let rightA = function () { beginShape(); arc(pos.x - this.r * 2.2, pos.y - 20, this.r * 3, this.r * 3, PI, TWO_PI);endShape(); };
       let leftA = function () { beginShape(); arc(pos.x - pos.x + this.r * 2.2, pos.y - 20, 250, 250, PI, TWO_PI);endShape(); };
       rightA();
       leftA();
      };
     
    this.render=()=>{
       stroke(255, [100]);
       strokeWeight(3);
       fill('white');
       beginShape();
       triangle(25, 150, 150, 25, 25, 25);
       endShape();
       
       
    };
 }



// words = (x, y) => {
//    push();
//    fill(200, 200, 20, 150);    
//    ellipse(width - 225, height - 125,50);
//    ellipse(155, height - 125,50);
//    pop();
//    push();
//    fill(0, 200, 20, 150);    
//    textAlign(CENTER);
//    this.text("Move", width - 225, height - 125, 100, 100);
//    this.text("Fire", 155, height - 125, 100, 100);
//    pop();
//    return;


function right() {
  let brunt=new shapes(155, document.innerHeight - 125,'red',80,80);
brunt.render();
brunt.clicked();
brunt.clickedL();
brunt.paddles(155, document.innerHeight - 125,150);

}
function left() {
   let labuan=new shapes(this.innerWidth - 225, this.innerHeight - 125,80,'red',80,80);
   labuan.render();
   labuan.clicked();
   labuan.clickedL();
   labuan.paddles(this.innerWidth - 225, this.innerHeight - 125,75);
   


}
//  };
let l,r;
function setup(){           
    cans = createCanvas(innerWidth - 30, innerHeight - 30, "WEBGL");
cans.parent("agame"); 
 
 



}
function draw(){
  
   
left();

right();



}

