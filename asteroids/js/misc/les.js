var particles = [];
var ship = [];
function center(pos)
{
   posW = (windowWidth / 2);
   posH = (windowHeight / 2);
   this.pos(posW, posH);
  return
}


function setup()
{
   
   createCanvas(windowWidth, windowHeight, '2D');
    
    for (var i = 0; i < 200; i++) {
         particles.push(new Particle1());
     }  
    
}
function draw()
{
    reverse(NAME);
    
    background(0, [255]);
    //translate(this.x + width / 2, this.y + height / 2);

    for (var part = 0; part < particles.length; part++) {
        //particles[part].breakup();
        particles[part].render();
        particles[part].update();
        particles[part].edges();
       
    }
    let i = 0;
    do { strokeWeight(1); stroke(random(0, 255)); line(mouseX+i, height, 100, sin(i)), i++ }
        while (i < 360);
        
    
    //point(x, y)
   
        clock(mouseX, mouseY);


}