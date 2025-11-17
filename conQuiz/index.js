

function getIt(a) {
  return document.querySelector(a);
}
function getAll(a) {
  return document.querySelectorAll(a);
}
function addTo(a, b) {
  return a.append(b);
}
function buildIt(a, b) {
  let it = document.createElement(a);
  it.id = b;
  return it;
}

const wrap = getIt("#wrap"),
  header = getIt("#header"),
  title = getIt("#title"),
  main = getIt("#main"),
  questions = getIt("#questions"),
  answers = getIt("#answers");

let cardinfo = [],
score=0;

// on open
function setup() {
  addTo(getIt("body"), getIt("#card").content.cloneNode(true));
}

class sendtoopt {
  constructor(args, cnt, ca, i) {
    let que = getIt("#questions");

    que.addEventListener("click", (e) => {
      this.cnt = cnt;
      this.ca = ca;
      let tgs = e.target;
      let tgt = tgs.getAttribute("data-cnt").split(",");
     
      if (tgt[i] == undefined) {
        return;
      }
      let sp=getAll("span");
     sp.forEach((s)=>{
    
      if(s===tgs){
        s.classList.add("active");}
      else{
        
        s.classList.remove("active");
    } })
    
      let label = getIt(`#label${i}`);
      label.innerHTML = "";
      label.setAttribute("data-ans", tgs.getAttribute("data-ans"));
      label.setAttribute("style","background:transparent");
      label.addEventListener("click", chechLabel);
      addTo(label, tgt[i]);
    });

    let qu = buildIt("span", `question${i}`);
    qu.setAttribute("data-cnt", cnt);
    qu.setAttribute("data-ans", ca);
    qu.innerHTML += args;
    que.append(qu);
  }
}
function chechLabel(e){
  let lbl=e.target,
  a=lbl.getAttribute("data-ans"),b=lbl.innerText;
  if(a===b){
  getIt("#score").setAttribute("data-scr",score+=5);
  lbl.setAttribute("style", "color:#000;background:#0f0");}
else{
  getIt("#score").setAttribute("data-scr",score-=1);
  lbl.setAttribute("style", "background:#f005")
}

  console.log(lbl);
}
const quiz=[
  "J_son/c0.json",
  "J_son/c1.json",
  "J_son/c2.json",
  "J_son/c3.json",
  "J_son/s0.json",
  "J_son/s1.json",
  "J_son/s2.json",
  "J_son/s3.json",
  "J_son/s4.json",
  ];
function next(){
 let result= fetch(qz= quiz[Math.floor(Math.random()*quiz.length)]);
 console.log(result);
      return result;
   }
const opn = async () => {
  console.log("The")
  const rslt = await next(),
  dn = await rslt.json();
  const q = [{ question: "your question" }, ...dn.questions];
  setup();
  q.forEach((prt, i) => {
    cardinfo[i] = {
      question: prt.question,
      answers: prt.answers,
      correctAnswer: prt.correctAnswer,
    };
  });

  cardinfo.forEach((c, i) => {
    new sendtoopt(c.question, c.answers, c.correctAnswer, i);
    console.log();
  });
};
window.onload = opn;
