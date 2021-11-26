function resetGame() {
  class AllTime {
    constructor(score) {
      this.score = score;
      return this.score;
    }
  }
  // Set = () => {};
  var allTime = [];
  if (gameOver) {
    allTime.push(new AllTime());
    allTime = allTime.concat(this.score);
    //var lifeSpan;
    if (allTime.length > 6) {
      allTime.splice(0, 1);
    }
  }
  console.log(allTime.length);
  
  score = 0;
  ship = [];
  asteroids = [];
  damg = 0;
  levelArray = [];
  parts = [];
  level = [];
  lasers = [];
  // var life = [];
  // var Level = 5;
  const shipnum = 3;
  const astnum = 20;

  
  for (let i = 0; i < shipnum; i++) {
    ship.push(new Ship());
  }

  for (let j = 0; j < astnum; j++) {
    asteroids.push(new Asteroid());
  }


}