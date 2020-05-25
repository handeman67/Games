
for (var i = 0; i < asteroids.length; i++) {
    if (Ship.hits(asteroids[i])) {
        fill(255);
        if (hits(2) && fill(255)) {
            fill(0, 100, 0, 80);
        } else if (hits(4) && ship.fill(0, 100, 0, 80)) {
            fill(255, 0, 0, 80);
        } else if (hits(8) && ship.fill(255, 0, 0, 80)) {
            fill(255, 10, 0);
        } else if (hits(10) && ship.fill(255, 50, 0)) {
            ship.shipFrame = triangle(0, 0, 0, 0, 0, 0);
            line(x, y, x + 2, y + 2);
        }
        console.log('ooops!'); frames = 1;

        if (this.hits == true && fill == fill(255)) {
            fill(0, 100, 0, 80);
        } else if (this.hits == true && fill == fill(0, 100, 0, 80)) {
            fill(255, 0, 0, 80);
        } else if (this.hits == true && fill == fill(255, 0, 0, 80)) {
            fill(255, 10, 0);
        } else if (this.hits == true && fill == fill(255, 50, 0)) {
            this.shipFrame = triangle(0, 0, 0, 0, 0, 0);
            line(x, y, x + 2, y + 2);
        }
    }
}