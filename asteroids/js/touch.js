const app = document.querySelector(".app");
const result = document.querySelector(".result");
const tches = [];
function strt(event) {
    let sx = event.touches[0].screenX;
    let sy = event.touches[0].screenY;
    let cx = event.touches[0].clientX;
    let cy = event.touches[0].clientY;
  console.log("start", sx);
  tches.push(sx);
  result.innerHtml =sx;
return;}
app.addEventListener("touchstart", strt);

//  {let result = document.querySelector(".result");
//   let text = document.creatTextNode("start Touching.");
// result.append(text);}
