Scored = function ()
{
   var i = 0;
   var score = 0;
   

            if (this.ship.hits(asteroids)) {
               score += -10;
            }
            if (this.laser.hits(asteroids)) {
               score += i++ + this.r;

            }
            push();
            stroke(0, 200, 20);
            fill(255);
            textSize(25);
            text("Score" + '  ' + score, 10, 10, 200, 100);
            //text('Score' + ' ' + ':' + ' ' + Scores[s], 20, 10, 140, 80);

            pop();
        
}
