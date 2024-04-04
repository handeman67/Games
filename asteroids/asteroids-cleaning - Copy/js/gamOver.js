
const wcenter=innerWidth / 2;
const hcenter=innerHeight / 2;
let game_over=false;

function setText(tx1,tx2,x,y){
 return text(
    `${tx1}:${tx2}`,width / 2 - x,height / 2 + y,
200,200);}

function gameOver() {
  game_over=true;
  
  push();
  stroke(0);
  fill(255);
  textSize(20);
  let t;
  G.allTime[0] > G.score? t= G.allTime[0]: t= G.score;

  setText('High Score',t,200,0);
  setText('Your Score',G.score,200,25);
  setText('All Time Highs',"",70,50);

  setText('#1 Player',G.allTime[0],150,70);
  setText('#2 Player',G.allTime[1],150,90);
  setText('#3 Player',G.allTime[2],150,110);
  setText('#4 Player',G.allTime[3],150,130);
  setText('#5 Player',G.allTime[4],150,150);
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
  translate(width / 2 - 150, height / 2 - 200);
  text("GameOver", 0, 0, 0, 100);
  pop();

  G.ship.splice(0,1);

  return;
}
