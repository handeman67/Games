/*jshint esversion: 6 */

function setup() {

    createCanvas(wth,hgt, P2D);
    wall(wallspecs);
   
    
    while (balls < vrs.num) {
        let ball = new Ball(vrs.center, 50, 10, 50);
        balls.push(ball);

    }


    let paddle = new Paddle(vrs.center, hgt-vrs.offset*vrs.Size/2,50,10,0);
    player.push(paddle);

    for (let i = 0; i < vrs.num; i++) {
        let block = new Block(random(vrs.Size,wth-vrs.Size), random(hgt),50,10,color(random(255),random(255),random(255)),`${i+1}`);
        blok.push(block);
    }

  
}

function draw() {
    
    rectMode(RADIUS);
    ellipseMode(RADIUS);
    background(200, 200, 20);
    for (let b of balls) {
       
        b.show_b();
        b.update_b();
        b.showtext(`x : ${Math.floor(b.pos.x)}`,50,200);
        b.showtext(`y : ${Math.floor(b.pos.y)}`,250,200);
        b.showtext(`bouncing: ${b.bounce}  num= ${bounces.length}`,50,100);
        b.showtext(`mouse X : ${mouseX}  mouse Y : ${mouseY}`,50,150);
        for (let W of Walls) {
            W.show_bl();
            // b.hits(W);
            for (let p of player) {
                p.show_p();
                p.update_p();
                p.hits(W,p,100);
                b.hits(p,b,40);
                b.hits(W,b,50);
                // W.hits(p,W);
                // W.hits(b,W);
                for (let bl of blok) {
                    bl.show_bl();
                //    p.detection(b)
                //    p.detection(W)
                    
                  
                    
                //   
                 if(this.collide){
                     console.log("inside the draw function.")
                  };
                }
            }
        }
    }

}
