/*jshint esversion: 6 */


const balls = [];
const player = [];
const center = innerWidth / 2;
const centerh = innerHeight / 2;
const bottom = innerHeight / 1.1;
const width = innerWidth - 50;
const height = innerHeight - 50;
const num = 3;
const size = 15;

centerh //?

function setup() {
    createCanvas(width, height, P2D);
    while (balls < num) {
        let ball = new Ball(width, height, size);
        balls.push(ball);

    }


    let paddle = new Paddle(center, bottom);
    player.push(paddle);


}

function draw() {
    background(200, 100, 20);
    for (let p in player) {
        player[p].showp();
        player[p].updatep();
    }
    for (let b in balls) {
        balls[b].showb();
        balls[b].updateb()
    }

}