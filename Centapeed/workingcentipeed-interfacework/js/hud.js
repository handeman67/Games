
let hud = () => {
   document.getElementById('one').innerHTML = GameScore;
   document.getElementById('two').innerHTML = level;
   document.getElementById('three').innerHTML = dots.length;
   document.getElementById('four').innerHTML = lasers.length;
   document.getElementById('five').innerHTML = field.length;
   document.getElementById('six').innerHTML = dots.sp;
   // document.getElementById('eight').innerHTML = floor(mouseX);
   // document.getElementById('nine').innerHTML = floor(mouseY);
   document.getElementById('ten').innerHTML = floor(frameRate());
}
