function clock(x, y)
{
   let i = 0;
   push()
   this.x = x;
   this.y = y;
   const hr = hour() % 12;
   const min = minute();
   const sec = second();
   const mill = millis();
   textSize(30);
   strokeWeight(4);
   stroke(255, [0], [25], [100]);
   //translate(width/2, height/2)
   text(hr + ':' + min + ':' + sec, this.x, this.y);

}
   
