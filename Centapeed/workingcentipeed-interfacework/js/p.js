class Player {

    constructor(spos, size, sp) {
        let t = this;
        t.pos = createVector(spos.x, spos.y);
        t.s = size = 20;
        t.sp = sp || mouseX;
        t.cl = color(random(350), random(100), random(100), 1);
        t.inc = [];
        t.inc.push("");
    }
    move() {
        let t = this;
        let KD = keyIsDown;
        if (KD(37)) {
            t.pos.x -= t.sp;
        }
        if (KD(39)) {
            t.pos.x += t.sp;
        }
        if (KD(38)) {
            t.pos.y -= t.sp;
        }
        if (KD(40)) {
            t.pos.y += t.sp;
        }
    }
    render() {
        let t = this;
        push();
        ellipseMode(CENTER);
        strokeWeight(2);
        stroke(0, 255, 0);
        fill(t.cl);
        line(t.pos.x, t.pos.y, t.pos.x, t.pos.y - 20);
        // triangle(t.pos.x, t.pos.y, -t.pos.x, -t.pos.y, t.pos.x, t.pos.y);
        ellipse(t.pos.x, t.pos.y, t.s);
        pop();
    }
    edges() {
        let t = this;
        let h3 = height / 1.3;
        let w = width - t.s;
        let h = height - t.s;
        if (t.pos.x > w) {
            t.pos.x = w;
        } else if (t.pos.x < w - w + t.s) {
            t.pos.x = w - w + t.s;
        }
        if (t.pos.y > h) {
            t.pos.y = h;
        } else if (t.pos.y < h3) {
            t.pos.y = h3;
        }
    }
    hits(inc) {
        let t = this;
        var d = dist(t.pos.x, t.pos.y, inc.pos.x, inc.pos.y);
        if (d < t.s + inc.s) {
            return true;
        }
    }
}

plr = function (e) {

    if (e.length < 1) {
        for (var p = 0; p < 1; p++) {
            e.push(new Player(100, 50, 3));
        }
    }
    return e;
};

playerLoad = function () {
    for (let p of player) {
        p.move();
        p.render();
        p.edges();
        keyPressed = () => {
            if (keyCode === (96)) {
                if (lasers.length >= lasercount) {
                    return; }
                lasers.push(new Laser(player[0].pos, 5, 5));
            }
            return;
        };
    

        //player[p].keyPressed();;
    
        for (let d of dots) {
            if (p.hits(d)) {
                console.log(player);
                player.splice(0, 1);
                dots.splice(0, 1);
            }
        }
    }
};
////////////////////////////////////////////

function mobilTouch(){
    if(touches.length > 1){
        touches.splice(0,1);
    }
    let can= document.getElementById("can2");
    
    can.addEventListener("touchstart",handleStart);
    can.addEventListener("touchend",handleEnd);
    can.addEventListener("touchmove",handleMove);
    can.addEventListener("touchcancel",handleCancel);
    console.log("initalized");
    }
    
    function handleStart(ev){ 
      let touch =new TouchEvent("touchStarted()");
      mousepos()
          if (lasers.length >= lasercount) {
              return;
          }else if(player.length>=1){
          mobilTouch();
            lasers.push(new Laser(player[0].pos, 5, 5)); 
          }
        
    }

    function mousepos(){
            touches.push(Math.floor(player[0].pos.x - mouseX));
          

  while(player[0].pos.x !== mouseX )
            player[0].pos.x += touches[0];
    }
    function handleEnd(ev){
      let touch =new TouchEvent("touchEnd()");
     
      console.log(touch.type);
    }
    function handleCancel(ev){
      let touch =new TouchEvent("touchCancel()");
      console.log(touch.type,touches[0]);
    }
    function handleMove(ev){
        mousepos();
      let touch =new TouchEvent("touchMove()");
      console.log(touch.type,touches[0],touches[1]);
    }
    
    