for (var s = ship.length - 1; s >= 0; s--) {
   for (var j = asteroids.length - 1; j >= 0; j--) {
      if (ship[s].hits(asteroids[j])) {
         if (ship.length === 0) {
            gameOver();
         } else {
            bl.play();
            Score += -10;
            if (asteroids[j].r > 10) {

               var newAsteroids = asteroids[j].breakup();
               asteroids = asteroids.concat(newAsteroids);
            }
            asteroids.splice(j, 1);
            ship.splice(s, 1);
            break;
         }
      }
   }
}