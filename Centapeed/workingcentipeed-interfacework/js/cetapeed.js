var level = 1;
var GameScore = 0;
var dots = [];
var mush = [];
var lasers = [];
var shroom = [];
const wt = innerWidth / 1.2;
const ht = innerHeight/ 1.5;

function setup() {
    // canvas setup
    Can(wt, ht);
    //loadJSON(config.json, [callback], [errorCallback], [datatype])
    ///player setup   
    plr();
    ///dots setup
    Dts();
    levelup = function() {
            level = level + 1;
            Dts(2);
            // dots.sp = dots.sp += 1;
        };
        //Game Text in hud
        /// create random Master FIELD
    loadField();
}

function draw() {
    console.log(keyCode);
    background(bg);
    hud();
    fld();
    playerLoad();
    dotsLoad();
    MushLoad();
    loadLaser();
    //setInterval(draw, 60);
}

fld = function() {
    for (var i = 0; i < field.length; i++) {
        field[i].show();
    }
};

levelup = function() {
    level = level + 1;
    Dts();
    GameScore += 1;

};