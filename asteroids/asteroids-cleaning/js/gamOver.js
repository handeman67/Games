function gameOver() {
  push();

  stroke(0);
  fill(255);
  textSize(20);

  text(
    "High Score" + ":" + this.score,
    width / 2 - 100,
    height / 2,
    200,
    200
  );
  //   text("All Time Highs", width / 2 - 100, height / 2 + 50, 200, 200);
  //     text(
  //         "#1" + " " + "player" + "-" + allTime[1],
  //     width / 2 - 100,
  //     height / 2 + 70,
  //     200,
  //     200
  //   );
  //   text(
  //     "#2" + " " + "player" + "-" + allTime[2],
  //     width / 2 - 100,
  //     height / 2 + 90,
  //     200,
  //     200
  //   );
  //   text(
  //     "#3" + " " + "player" + "-" + allTime[3],
  //     width / 2 - 100,
  //     height / 2 + 110,
  //     200,
  //     200
  //   );
  //   text(
  //     "#4" + " " + "player" + "-" + allTime[4],
  //     width / 2 - 100,
  //     height / 2 + 130,
  //     200,
  //     200
  //   );
  //   text(
  //     "#5" + " " + "player" + "-" + allTime[5],
  //     width / 2 - 100,
  //     height / 2 + 150,
  //     200,
  //     200
  //   );

  pop();

  push();
  rectMode(CENTER);
  stroke(255, 200);
  strokeWeight(4);
  noFill();

  rect(width / 2, height / 2, width * 0.8, height * 0.8, 50, 50, 50, 50);

  pop();

  push();
  stroke(random(100, 255), 0, 0, random(100, 255));
  strokeWeight(4);
  noFill();
  textSize(60 % windowWidth);
  translate(width / 2, height / 2 - 200);
  text("GameOver", 0, 0, 0, 100);
  pop();

  ship.splice[0];

  return;
}
