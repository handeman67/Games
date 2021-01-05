function setup() {
  createCanvas(displayWidth, displayHeight);
  rectMode(CENTER);
}

function draw() {
  background(50);
  noStroke();
  fill(255);
  rect(width / 2, height / 2, touchY, touchX);
}

function touchMoved() {
  // otherwise the display will move around
  // with your touch :(
  return false;
}