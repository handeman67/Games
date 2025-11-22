const bdy = document.body;
const balls = [];
const ballPos = [];
const tgt = [];
const comp = [];
const scr=[];
const chess = ['♚', '♛', '♜', '♝', '♞', '♟', '♔', '♕', '♖', '♗', '♘', '♙', '♚', '♛', '♜', '♝', '♞', '♟', '♔', '♕', '♖', '♗', '♘', '♙'];
const moji = ["🤡", "💩", "☠️", "😎", "🥵", "🤯", "😬", "🤪", "🥶"];
const monkey = ["🐵", "🙈", "🙉", "🙊"]
const tap=new Audio("./ping_pong.mp3");
const retap=new Audio("./boom.wav");
const win=new Audio("./beat2.wav");
const pos = {
  x: 0,
  y: 0
};

function A_(...b) {
  return `${b}`;
}


function loadvars() {
  this.board = document.querySelector(".wrap");
  this.result = document.querySelector(".result");
  this.posInfo = document.querySelector(".posInfo");
  this.score = document.querySelector(".score");
  this.score.innerHTML="SCORE:0";
  this.posInfo.innerHTML="LastSpot:0";
  this.wth = this.board.clientWidth;
  this.hgt = this.board.clientHeight;
  this.buffer = 10;
  this.count = this.buffer % this.wth;
  this.sz = (this.wth / this.count);
  this.lt = this.buffer;
  this.rt = this.wth - this.buffer;
  this.tp = this.buffer;
  this.bt = this.hgt - this.sz;
  return this;
}

function _(a, c, e, f) {
  let b = document.createElement(a);
  b.classList.add(`${c}`);
  return b;
}

function run() {

  loadvars();

  for (let i = 0; i < this.rt; i += this.sz) {
    pos.x = Math.floor(i);
    for (let j = 0; j < this.bt; j += this.sz) {
      bdy.style.setProperty("--sz", `${this.sz}px`);
      bdy.style.setProperty("--fontsize", `${this.sz-10}px`);
      pos.y = Math.floor(j);
      ballPos.push(pos);

      let b = _("div", "ball", pos.y, pos.x);
      let rm = _("div", "ballend", pos.y, pos.x);

      rm.classList.add("ballsend");
      rm.dataset.moji = moji[Math.floor(Math.random() * moji.length)];

      b.addEventListener("click", reolvePos);
      styled(pos.y, pos.x, b);
      styled(pos.y, pos.x, rm);

      board.append(rm);
      balls.push(b);
      this.board.append(b);

      this.posInfo.dataset.posinfo=A_(pos);

      if ((i >= this.wth) & (j >= this.hgt)) {
        break;
      }
    }
  }
}

function styled(a, b, c) {
  c.style = `font-size:${this.sz};position: absolute;top:${a}px;left:${b}px;width:${this.sz}px;height:${this.sz}px`;
  c.dataset.posx = a;
  c.dataset.posy = b;
  return c;
}

function reolvePos(e) {
  if(e.target.classList.contains("ballend")){
    return;
  }
  const box = e.target;
  if(tgt.length>=2){
    tgt.splice(0,1);
  }
  tgt.push(box);
  const all = document.querySelectorAll('.ballsend');
  box.style.opacity = 0;

  loop(all, box, comp);
  checkMatch(comp);

}
function clearArr(a){
  if (a.length > 0) {
    a.splice(0, 2);
 return a;
  }
 }
function checkMatch(comp) {
  if(event.target.classList.contains("ballend")){
    return;
  }
  tap.play();
  if (comp.length == 2) {
    setTimeout((e) => {
      let one = comp[0];
      let on = one.dataset.moji;
      let two = comp[1];
      let tw = two.dataset.moji;
      let chk1=one.classList;
      let chk2=two.classList;
      if(!chk1.contains('ballend') & !chk2.contains('ballend') && chk1.contains('ball') & chk2.contains('ball')){
console.log("YUP");
      }
      if (on === tw) {
        win.play();
        two.dataset.moji="*";
        one.dataset.moji="*";
        one.style.opacity = 0;
        two.style.opacity = 0;
        clearArr(comp);
        scr.push(on);
        this.score.innerHTML=`SCORE :${scr.length}`;
        console.log(this.score);
      }
      if (on !== tw) {
        console.log(on,tw);
        tgt.forEach((tg) => {
          retap.play();
          tg.style.opacity = 1;
          console.log("i can see","🐵");
          clearArr(comp);
         
        });
      }
    }, 1000);


  }
}

function loop(a, b, d) {
  a.forEach((moj) => {
    const T = b.dataset.posy;
    const L = b.dataset.posx;
    let t = moj.dataset.posy;
    let l = moj.dataset.posx;
    let mj = moj.dataset.moji;
    posInfo.innerHTML ="LastSpot:"+A_(T, L);
    if (l == L & T == t) {
      d.push(moj);
    }
  });
}








// }
bdy.addEventListener("load", run());
window.addEventListener("resize", windowsize);

function windowsize() {
  this.board.innerHTML = "";
  return run();
}

function runnew() {
  const spot = document.querySelectorAll(".ballend");
  this.board.innerHTML = "";
  spot.forEach((sp) => {
    sp.remove();
  });
  return run();
}