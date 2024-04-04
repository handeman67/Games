var level = 1;
var GameScore = 0;
var dots = [];
var mush = [];
var lasers = [];
var shroom = [];


// const wt = 25*cr;
// const ht = 25*hr;
const ch=document.querySelector(".active");
if(ch){
console.log();
}

    wt=ch.clientWidth;
    ht=ch.clientHeight; 



function setup() {
    Can(wt, ht); 
    plr(player);
    Dts();
    loadField();
    mobilTouch();
}

function draw() {
    // console.log(keyCode);
   background(bg);
   hud();
    fld();
    playerLoad();
    dotsLoad();
    MushLoad();
    loadLaser();
   
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
