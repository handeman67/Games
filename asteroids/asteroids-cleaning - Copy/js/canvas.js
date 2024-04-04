function Can(w, h, web) {

   var cans = document.getElementById("astcanv").innerHTML
   createCanvas(w, h, web).parent(cans);
   cans(style = "position", "inherit");
   cans(style = 'display', 'block');
   cans(style = 'backgroundColor', " white");





   colorMode(HSB, 360, 100, 100);
   bg = color(30, 80, 80, 1);



   document.addEventListener(
      "touchstart",
      function () {
         return false;
      },
      false
   );

   //Keyboard Fire Mechinism
   keyPressed = () => {

      if (keyCode === (96)) {
         if (lasers.length >= 1) {
            return
         }

         lasers.push(new Laser(player[0].pos, 5, 5));
      }
  
      return
   };
}