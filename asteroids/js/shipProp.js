<<<<<<< HEAD
for (var s = ship.length - 1; s >= 0; s--) {
=======
>>>>>>> 6e63db0a0b5a0b2aebb08a2ab60a835bbb8dfd3c
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
<<<<<<< HEAD
=======
for (var s = ship.length - 1; s >= 0; s--) {
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
>>>>>>> 6e63db0a0b5a0b2aebb08a2ab60a835bbb8dfd3c
}