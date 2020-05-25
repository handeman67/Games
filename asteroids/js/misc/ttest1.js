var shape=[];
function setup()
{
   createCanvas(windowWidth, windowHeight);
   
      shape=(new shapes());
      max_distance = dist(shape.pos.x, shape.pos.y, 20, 20);


      shape.rightA();
      ;

}
function draw()
{
      background(100, 255);
      shape.showCoords(shape.leftA())
      
      //shape.render();
      // this.clicked(shape.rightA(i), shape.leftA(i), shape.pos.x, shape.pos.y) = {
      //       for(var: i = 0; i<shape.length; i++) {
      //       shapes.render();
            
      //}
//}

      console.log(clicked)
      push();
      fill(255, 255, 255,255);
      
      
      ellipse(mouseX, mouseY, 50);
      pop();


      for (var i = 0; i <= width; i += 10) {
            for (var j = 0; j <= height; j += 10) {
                  var size = dist(mouseX, mouseY, i, j);
                  size = size / max_distance * 60;
                  rect(i, j, size, size);
            }
      }
}
