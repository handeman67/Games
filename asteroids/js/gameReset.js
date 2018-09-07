function resetGame() {
  // function AllTime(score) {
  //   this.score = score;
  // }
  // Set = () => {};
  // var allTime = [];
  // if (gameOver) {
  //   allTime.push(new AllTime());
  //   allTime = allTime.concat(this.score);
  //   //var lifeSpan;
  //   if (allTime.length > 6) {
  //     allTime.splice(0, 1);
  //   }
  // }
  // console.log(allTime.length);
  //AllTime();
  score = 0;
  ship = [];
  asteroids = [];
  damg = 0
  levelArray = [];
  parts = [];
  level = [];
  // var damg = 0;
  lasers = [];
  // var life = [];
  // var Level = 5;
  var beat = 2000;
  var shipnum = 3;
  var astnum = 20;

  setInterval(() => {
    bt1.play();
  }, beat);

  for (var i = 0; i < shipnum; i++) {
    ship.push(new Ship());
  }

  for (var j = 0; j < astnum; j++) {
    asteroids.push(new Asteroid());
  }


}