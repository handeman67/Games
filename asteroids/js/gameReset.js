function resetGame() {
      let e = this;
    Controls();
    button();
  
    e.parts = [];
    e.level = 1;
    e.damg = 0;
    e.lasers = [];
    e.shipNum = 3;
    e.astNum = 2;   
    e.R = 255;
    e.G = 255 - damg;
    e.B = 255 - damg;
    e.cans;
    e.bkg;
    e.score = 0;
    e.ship = [];
    e.asteroids = [];
    lasers = [];
     
    Set = () => {
        console.log(allTime.length);
     }

    
    e.beat = 2000;
    e.shipnum = e.shipNum;
    e.astnum = e.astNum;
    const playSouns = () => {
        e.setInterval(() => {
            bt1.play();
        }, beat);

    }

    for (var i = 0; i < shipnum; i++) {
        if (ship.length > e.shipNum) {
            ship.splice(0, 1)
            return
        }
        e.ship.push(new Ship());
    }

    for (var j = 0; j < astnum; j++) {
        if (asteroids.length > e.astNum) {
            asteroids = []
            return
        }
        e.asteroids.push(new Asteroid());
    }
    return e
}
