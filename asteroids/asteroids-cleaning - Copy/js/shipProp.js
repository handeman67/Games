for (let s =     G.ship.length - 1; s >= 0; s--) {
   for (let j = G.asteroids.length - 1; j >= 0; j--) {
      if (G.ship[s].hits(G.asteroids[j])) {
         if (G.ship.length === 0) {
            gameOver();
         } else {
            bl.play();
            G.score += -10;
            if (G.asteroids[j].r > 10) {

               let newAsteroids = G.asteroids[j].breakup();
               G.asteroids = G.asteroids.concat(newAsteroids);
            }
            G.asteroids.splice(j, 1);
            G.ship.splice(s, 1);
            break;
         }
      }
   }
}
