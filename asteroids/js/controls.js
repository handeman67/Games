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
            let x = 20 + 40 * i
            translate(x, 30);
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
            script.onload = function() {
                let stats = new Stats();
                stats.domElement.style =
                    "position: fixed; top: 0; left: 50%; cursor: pointer; opacity: 0.9; z-index: 10000;color:yellow;font-size:20px;font-weight:bold;;font-family:verdana;font-style:italic;";
                document.body.appendChild(stats.dom);
                requestAnimationFrame(function loop() {
                    stats.update();
                    requestAnimationFrame(loop);
                });
            };
            src = `<script>(function(f,e){"object"===typeof exports&&"undefined"!==typeof module?module.exports=e():"function"===typeof define&&define.amd?define(e):f.Stats=e()})(this,function(){var f=function(){function e(a){c.appendChild(a.dom);return a}function u(a){for(var d=0;d<c.children.length;d++)c.children[d].style.display=d===a?"block":"none";l=a}var l=0,c=document.createElement("div");c.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click",function(a){a.preventDefault();
u(++l%c.children.length)},!1);var k=(performance||Date).now(),g=k,a=0,r=e(new f.Panel("FPS","#0ff","#002")),h=e(new f.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var t=e(new f.Panel("MB","#f08","#201"));u(0);return{REVISION:16,dom:c,addPanel:e,showPanel:u,begin:function(){k=(performance||Date).now()},end:function(){a++;var c=(performance||Date).now();h.update(c-k,200);if(c>=g+1E3&&(r.update(1E3*a/(c-g),100),g=c,a=0,t)){var d=performance.memory;t.update(d.usedJSHeapSize/
1048576,d.jsHeapSizeLimit/1048576)}return c},update:function(){k=this.end()},domElement:c,setMode:u}};f.Panel=function(e,f,l){var c=Infinity,k=0,g=Math.round,a=g(window.devicePixelRatio||1),r=80*a,h=48*a,t=3*a,v=2*a,d=3*a,m=15*a,n=74*a,p=30*a,q=document.createElement("canvas");q.width=r;q.height=h;q.style.cssText="width:80px;height:48px";var b=q.getContext("2d");b.font="bold "+9*a+"px Helvetica,Arial,sans-serif";b.textBaseline="top";b.fillStyle=l;b.fillRect(0,0,r,h);b.fillStyle=f;b.fillText(e,t,v);
b.fillRect(d,m,n,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d,m,n,p);return{dom:q,update:function(h,w){c=Math.min(c,h);k=Math.max(k,h);b.fillStyle=l;b.globalAlpha=1;b.fillRect(0,0,r,m);b.fillStyle=f;b.fillText(g(h)+" "+e+" ("+g(c)+"-"+g(k)+")",t,v);b.drawImage(q,d+a,m,n-a,p,d,m,n-a,p);b.fillRect(d+n-a,m,a,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d+n-a,m,a,g((1-h/w)*p))}}};return f});</script>`;
            document.head.appendChild(src);
        }
    };
    // setting = () => {

    // settings.addBoolean(title, value, callback);                // creates a checkbox
    // settings.addButton('hide', settings.hideAllTitles);    // creates a button
    // settings.toggleVisibility()
    // settings.hideAllTitles();
    // settings.showAllTitles();
    // settings.addColor(title, color, callback);                  // creates a color input
    // settings.addDate(title, date, callback);                    // adds a date input
    // settings.addDropDown('Games', [1, 2, 3, 4, 5, 6]); // creates a dropdown list
    // settings.addElement(title, htmlELement);                    // adds any arbitrary HTML element to the panel
    // settings.addFileChooser(title, labelStr, filter, callback); // adds a file chooser
    // settings.addHTML(title, htmlString);                        // adds any arbitrary HTML to the panel
    // settings.addImage(title, imageURL, callback);               // creates and image element with the specified URL
    // settings.addNumber(title, min, max, value, step, callback); // creates a number input
    // settings.addPassword(title, text, callback);                // adds a password text field
    // settings.addProgressBar(title, max, value, valueDisplay);   // creates a progress bar
    // settings.addRange(title, min, max, value, step, callback);  // creates a range slider
    // settings.addText(title, text, callback);                    // creates an input text field
    // settings.addTextArea(title, text, callback);                // creates a resizable text area
    // settings.addTime(title, time, callback);                    // adds a time input

    //     settings.setGlobalChangeHandler();
    //     return settings;

    // };
    // const settings = QuickSettings.create(0, 60, 'Settings');
    button = () => {
        let Open = false;
        // let toggleSetting = () => {

        // if (Open) {
        //     settings.show();
        //     button.html('hide');
        // } else {
        //     settings.hide();
        //     button.html('show');
        // }
        //     Open = !Open;
        // };
        let Pause = false
        let togglePause = () => {
                if (Pause) {
                    this.noLoop()
                    button4.html('unpause');
                } else {
                    this.loop()
                    button4.html(' -pause - ');
                }
                Pause = !Pause;
            }
            // let button = createButton('show');
            // button.mousePressed(toggleSetting);
            // button.position(128, 5);
            // button.id = "button"
        let button2 = createButton("Reset");
        button2.mousePressed(resetGame);
        button2.position(5, 5);
        button2.id = "button2"
        let button4 = createButton("-pause -");
        button4.mousePressed(togglePause); //setting
        button4.position(60, 5);
        button4.id = "button4";
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
