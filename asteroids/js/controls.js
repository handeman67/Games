const Controls = () => {
  
  Scored = () => {
    stroke(0, 200, 20);
    fill(255);
    textSize(25);
    text("Score" + "  " + score, width / 1.4, 70, 200, 100);
  };
  LevelT = () => {
    stroke(0, 200, 20);
    fill(255);
    textSize(25);
    text("Level" + "  " + level, width / 1.4, 10, 200, 100);
  };
  lives = () => {
    let red = 255;
    let green = 255 - this.damg;
    let blue = 255 - this.damg;
    stroke(0, 200, 20);
    fill(255);
    textSize(25);
    text("lives" + "  " + ship.length, width / 1.4, 100, 200, 100);
    for (let i in ship) {      
      push();
      let x=20+40*i
      translate(x,30);
      fill(red, green, blue, 255);
       triangle(-10, 10, 10, 10, 0, -10);      
      pop();
    }
 };
  damage = () => {
    let red = 255;
    let green = 255 - this.damg;
    let blue = 255 - this.damg;
    fill(red, green, blue, 255)
    text("Damage" + "  " + this.damg, width / 1.4, 40, 225, 100)
  };
  st = () => {
    if (st === true) {
      return false;
    } else {
      let script = document.createElement("script");
      script.onload = function () {
        let stats = new Stats();
        stats.domElement.style.position = "absolute";
        stats.domElement.style.left = "210px";
        stats.domElement.style.top = "40px";
        document.body.appendChild(stats.dom);
        requestAnimationFrame(function loop() {
          stats.update();
          requestAnimationFrame(loop);
        });
      };
      script.src = "//rawgit.com/mrdoob/stats.js/master/build/stats.min.js";
      document.head.appendChild(script);
    }
  };
// setting=()=>{
 
//   // settings.addBoolean(title, value, callback);                // creates a checkbox
//   // settings.addButton('hide', settings.hideAllTitles);    // creates a button
//   settings.toggleVisibility()
//     settings.hideAllTitles();
// settings.showAllTitles();
//   // settings.addColor(title, color, callback);                  // creates a color input
//   // settings.addDate(title, date, callback);                    // adds a date input
//   settings.addDropDown('Games', [1,2,3,4,5,6]);             // creates a dropdown list
//   // settings.addElement(title, htmlELement);                    // adds any arbitrary HTML element to the panel
//   // settings.addFileChooser(title, labelStr, filter, callback); // adds a file chooser
//   // settings.addHTML(title, htmlString);                        // adds any arbitrary HTML to the panel
//   // settings.addImage(title, imageURL, callback);               // creates and image element with the specified URL
//   // settings.addNumber(title, min, max, value, step, callback); // creates a number input
//   // settings.addPassword(title, text, callback);                // adds a password text field
//   // settings.addProgressBar(title, max, value, valueDisplay);   // creates a progress bar
//   // settings.addRange(title, min, max, value, step, callback);  // creates a range slider
//   // settings.addText(title, text, callback);                    // creates an input text field
//   // settings.addTextArea(title, text, callback);                // creates a resizable text area
//   // settings.addTime(title, time, callback);                    // adds a time input

// settings.setGlobalChangeHandler();

// }
  // const settings = QuickSettings.create(0, 60, 'Settings');
button = () => {  
 let Open=false;
 let toggleSetting=()=> {
 
    if (Open) {
      settings.show();
      button.html('hide');
    } else {
      settings.hide();
      button.html('show');
    }
    Open = !Open;
  }
  let Pause=false
  let togglePause=()=> {
    if (Pause) {
      this.noLoop()
      button4.html('unpause');
    } else {
      this.loop()
      button4.html(' -pause - ');
    }
    Pause = !Pause;
  }
  let button = createButton('show');
  button.mousePressed(toggleSetting);
  button.position(128, 5);
  button.id="button"
  let button2 = createButton("Reset") ;
  button2.mousePressed(resetGame);
  button2.position(5, 5);
  button2.id="button2"
  let button4 = createButton("-pause -"); 
  button4.mousePressed(togglePause);//setting
 button4.position(60, 5); 
 button4.id="button4";   
};

  words = (x, y) => {
    push();
    fill(0, 200, 20, 150);
    textSize(15);
    textAlign(CENTER);
    text("Move", width - 150, height - 100, 100, 100);
    text("Fire", 50, height - 100, 100, 100);
    pop();
  };
}