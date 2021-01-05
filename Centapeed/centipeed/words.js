function words() {

  push();
  fill(255, 255, 255);
  rect(0, 0, 200, 300, 20, 20, 0, 0);
  stroke(0);
  strokeWeight(4);
  textSize(20);
  textStyle(BOLD);
  text("player   " + player.length, 20, 25, 200, 20);
  if (player.length == 0) {
    stroke(255, 0, 0);
    text("player   " + player.length, 20, 25, 200, 20);
  }
  text("Dot   " + dot.length, 20, 50, 200, 20);
  text("lasers   " + lasers.length, 20, 75, 200, 20);
  text("Mush   " + mush.length, 20, 100, 200, 20);
  text("Dot #   " + dot.dd, 20, 125, 200, 20);
  text("Level   " + level, 20, 150, 200, 20);
  text("player   " + player.length, 20, 175, 200, 20);
  pop();
  if (lasers.length >= 8) {
    push();
    stroke(255, 0, 0);
    text("lasers   " + lasers.length, 20, 75, 200, 20);
    pop();

  }
}
