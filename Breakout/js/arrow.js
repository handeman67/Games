
   const Arrow=()=>{let v0 = createVector(50, 50);
   let v1 = createVector(mouseX - 50, mouseY - 50);
    push();
   stroke(100,255,0);
   strokeWeight(3);
   fill(100,100,100);
   translate(center,0);
   line(0, 0, vec.x, vec.y);
   rotate(vec.heading());
   let arrowSize = 7;
   translate(vec.mag() - arrowSize, 0);
   triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
   pop();
   drawArrow(v0, v1, 'black');
 
   let myHeading = v1.heading();
   noStroke();
   text(
     'vector heading: ' +
       myHeading.toFixed(2) +
       ' radians or ' +
       degrees(myHeading).toFixed(2) +
       ' degrees',
     10,
     50,
     90,
     50
   );
 }
