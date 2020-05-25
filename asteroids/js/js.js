  
let allTime=[];
function preload(sounds, images) {
    let e = this;
    Sounds();
    Images();
    function Images() {
        if (images) {
            e.images = images;
        } else {
            e.images = [
                bkg = loadImage('../IMG/stars.jpg')
            ];
        }
    }
    function Sounds() {
        if (sounds) {
            e.sounds = sounds;
        } else {
            e.sounds = [
                bl = loadSound("./sound/bangLarge.wav"),
                sm = loadSound("./sound/bangSmall.wav"),
                bm = loadSound("./sound/bangMedium.wav"),
                bt2 = loadSound("./sound/beat2.wav"),
                bt1 = loadSound("./sound/beat1.wav"),
                fire = loadSound("./sound/fire.wav"),
                xtraship = loadSound("./sound/extraShip.wav"),
                ss = loadSound("./sound/saucerSmall.wav"),
                bs = loadSound("./sound/saucerBig.wav"),
                thrust = loadSound("./sound/thrust.wav")
            ];
        }
        return e
    }
}
function windowResized() {
    resizeCanvas(innerWidth - 60, innerHeight - 3);
}
function setup() {
  
    cans = createCanvas(innerWidth - 30, innerHeight - 30, P2D);
    cans.parent("agame");
    resetGame();
    
    
}
function draw() {

    Background();
    Shipdamage();
    Shipcount();
    AstCount();
    Drawasteroids();
    Drawships();
    Drawparticles();    
    Scored();
    lives();
    damage();
    LevelT();
    words()
    // LevelT()
    if (lasers) {
        for (let l = lasers.length - 1; l >= 0; l--) {
            lasers[l].render();
            lasers[l].update();
            if (lasers[l].offscreen()) {
                lasers.splice(l, 1);
            } else {
                for (let j = asteroids.length - 1; j >= 0; j--) {
                    if (lasers[l].hits(asteroids[j])) {  
                        Asterhit(j, l);

                        break;
                    }
                }
            }
        }
    }

    function Asterhit(j, l) {
        score += 1 * floor(asteroids[j].r);
        let newParts = asteroids[j].pts();
        parts = parts.concat(newParts);
        Astbreakup(j);
        asteroids.splice(j, 1);
        lasers.splice(l, 1);
    }

    function Astbreakup(j) {
        if (asteroids[j].r > 15) {
            let newAsteroids = asteroids[j].breakup();
            asteroids = asteroids.concat(newAsteroids);
            score += 3 * floor(asteroids[j].r);
        }
    }

    function Drawships() {
        if (ship.length >= 1) {
            ship[0].move();
            ship[0].render();
            ship[0].update();
            ship[0].turn();
            ship[0].edges();
            ship[0].shiphits();
            //ship[0].defend();
        }
    }

    function Drawasteroids() {
        for (let j = asteroids.length - 1; j >= 0; j--) {
            asteroids[j].render();
            asteroids[j].update();
            asteroids[j].edges();
        }
    }

    function AstCount() {
        if (asteroids.length <= 0 || undefined) {
            if (ship.length >= 1) {
               new LEVELS(level);
                  level++;
                //noLoop();
            }
        }
    }

    function Shipcount() {
        if (ship.length <= 0 || undefined) {
            ship.splice[0];
            gameOver();
            //noLoop();
        }
    }

    function Shipdamage() {
        if (damg >= 255) {
            ship.splice(0, 1);
            damg = 0;
        }
    }

    function Background() {
        background(bkg);
    }
    // play(startTime, rate, amp, _cueStart, duration);
    // defend();

    //     for (var l = lasers.length - 1; l >= 0; l--) {
    //         lasers[l].render();
    //         lasers[l].update();
    //         if (lasers[l].offscreen()) {
    //             lasers.splice(l, 1);
    //         }
    //          else {
    //             for (var j = asteroids.length - 1; j >= 0; j--) {
    //                 if (lasers[l].hits(asteroids[j])) {

    //                     bl.play();
    //                     score += 3 * 13;

    //                     var partsVel = p5.Vector.add(lasers[l].vel.mult(0.2), 5)
    //                     var partsNum = (asteroids[j].r);

    //                 asteroids[j].explode()

    //                     if (asteroids[j].r > 15) {

    //                         var newAsteroids = asteroids[j].breakup();
    //                         asteroids = asteroids.concat(newAsteroids);
    //                     }
    //                     asteroids.splice(j, 1);
    //                     lasers.splice(l, 1);

    //                     break
    //                 }

    //             }
    //         }
    //     }
    // }

    // ufo= function(){

    //     setInterval(ufo() , 11000);



    // defend();

    //     for (var l = lasers.length - 1; l >= 0; l--) {
    //         lasers[l].render();
    //         lasers[l].update();
    //         if (lasers[l].offscreen()) {
    //             lasers.splice(l, 1);
    //         }
    //          else {
    //             for (var j = asteroids.length - 1; j >= 0; j--) {
    //                 if (lasers[l].hits(asteroids[j])) {

    //                     bl.play();
    //                     score += 3 * 13;

    //                     var partsVel = p5.Vector.add(lasers[l].vel.mult(0.2), 5)
    //                     var partsNum = (asteroids[j].r);

    //                 asteroids[j].explode()

    //                     if (asteroids[j].r > 15) {

    //                         var newAsteroids = asteroids[j].breakup();
    //                         asteroids = asteroids.concat(newAsteroids);
    //                     }
    //                     asteroids.splice(j, 1);
    //                     lasers.splice(l, 1);

    //                     break
    //                 }

    //             }
    //         }
    //     }
    // }

    // ufo= function(){

    //     setInterval(ufo() , 11000);
}

function Drawparticles() {
    for (let p = parts.length - 1; p > 0; p--) {
        parts[p].show();
        parts[p].update();
        //parts[p].cleared();
        if (parts[p].cleared()) {
            parts.splice(0, 1);
        }
    }
}