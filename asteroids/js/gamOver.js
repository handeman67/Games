
function gameOver() {
  let getCurrent;
  let setCurrent;
  let userName="steve"
  let date=new Date();
   let mill=date.getMilliseconds()//?
  date.toDateString()//?
    if(this.score==undefined){return}else{
      console.log(allTime)
  getCurrent=localStorage.getItem(userName);    
 setCurrent=localStorage.setItem(userName+" "+ (mill),this.score);//?
  }
 // window.onstorage =(e)=>{
//   console.log('The ' + e.key +
//     ' key has been changed from ' + e.oldValue +
//     ' to ' + e.newValue + '.');
// } 
  AllTime=()=> {
allTime.push(this.score);

// localStorage.clear();
  }
  push();
  stroke(0);
  fill(255);
  textSize(20);
  translate(-50,-50)
  text(
    "High Score" + ":" +this.score,
    width / 2 ,
    height / 2,
    200,
    200
  );
    text("All Time Highs", width / 2 - 100, height / 2 + 50, 200, 200);
      text(
          "#1" + " " + "player" + "-" + allTime[1],
      width / 2 - 100,
      height / 2 + 70,
      200,
      200
    );
    text(
      "#2" + " " + "player" + "-" + allTime[2],
      width / 2 - 100,
      height / 2 + 90,
      200,
      200
    );
    text(
      "#3" + " " + "player" + "-" + allTime[3],
      width / 2 - 100,
      height / 2 + 110,
      200,
      200
    );
    text(
      "#4" + " " + "player" + "-" + allTime[4],
      width / 2 - 100,
      height / 2 + 130,
      200,
      200
    );
    text(
      "#5" + " " + "player" + "-" + allTime[5],
      width / 2 - 100,
      height / 2 + 150,
      200,
      200
    );

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
  translate(-145,-20);
  text("GameOver", width/2, height/2-100, 0, 100);
  pop();

  ship.splice[0];

  return;
}
function storageAvailable(type) {
  var storage;
  try {
      storage = window[type];
      var x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
  }
  catch(e) {
      return e instanceof DOMException && (
          // everything except Firefox
          e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === 'QuotaExceededError' ||
          // Firefox
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
          // acknowledge QuotaExceededError only if there's something already stored
          (storage && storage.length !== 0);
  }
}