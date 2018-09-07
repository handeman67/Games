function setup()
{
   createCanvas(400, 400, WEBGL);
}

function draw()
{
   background(0, 0, 0);
   fill(255);

   beginShape();
   vertex(0, 0, 0);
   vertex(50, 0, 0);
   vertex(50, 50, 0);
   vertex(0, 50, 0);
   endShape(CLOSE);
}