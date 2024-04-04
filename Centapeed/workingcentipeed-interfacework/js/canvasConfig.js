const IF = (A, B) => {
    A = (A) ? A : B;
    return A;
};
const lasercount = 2;
const player=[];
const tches = [];
const touches=[];
const tches1=[];
function Can(w, h) {
    let can;
    can = createCanvas(w, h, "2d");
    can.parent("can2");
    colorMode(HSB, 320, 80, 80);
    bg = color(100, 80, 80, 1);
    
   
}

           
function MousePos(event) {
    let E = event.target;
    
   
    let sx = E.screenX||E.touches[0].screenX;
    let sy = E.screenY||E.touches[0].screenY;
    let cx = E.clientX||E.touches[0].clientX;
    let cy = E.clientY||E.touches[0].clientY;
  
    tches.push({ cx, cy, sx, sy });
  
    // tches.forEach((t) => {
    let t = tches.splice(0, 1);
    let X = cx;
    let Y = cy;
    let color = "";
  console.log("thisTEST",result1);
    const lngth = 10;

    console.log(touches,tches);
  
    return;
  }
  function touchPos(event) {
    let ev;

       ev = event.touchPos;
       console.log(ev);
      // let b = ev.radiusY;
      // let c = ev.radiusX;
      // let d = ev.target;
      // let f = event.touch;
    // if (event.type !== "touchstart") {
    //   ev = event;
      
    // }   
    mos = false;
    tch = false;
    let count = 0;
    tches1.push({});
    tches1.forEach((t) => {
    console.log(tch, " - X - ", tches.length);
      tch = false;
      count++;
    });
    return;
  }
     
  document.addEventListener("DOMMatrix",MousePos,touchPos);
