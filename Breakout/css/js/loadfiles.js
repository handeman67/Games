/*jshint esversion: 8 */
const clientWin = window.clientInformation || {};
const set = window.performance || {};
const clientCaches = window.caches || {};
const DocHtmlCode = window.document || {};
const compSelection = window.getSelection;
const inWidth = window.innerWidth;
const inHeight = window.innerHeight;
const aniEnd = window.onanimationend;
const aniIteration = window.onanimationiteration;
const aniStart = window.onanimationstart;
const auxClick = window.onauxclick;
// onchange: null
// onclick: null
// onclose: null
// oncontextmenu: null
// oncuechange: null
// ondblclick: null
// ondevicemotion: null
// ondeviceorientation: null
// ondeviceorientationabsolute: null
// ondrag: null
// ondragend: null
// ondragenter: null
// ondragleave: null
// ondragover: null
// ondragstart: null
// ondrop: null
// oninput: null
// oninvalid: null
// onkeydown: null
// onkeypress: null
// onkeyup: null
// onmousedown: null
// onmouseenter: null
// onmouseleave: null
// onmousemove: null
// onmouseout: null
// onmouseover: null
// onmouseup: null
// onmousewheel: null
// onoffline: null
// ononline: null
// onselect: null
// onselectionchange: null
// onselectstart: null
// onstorage: null
// onsubmit: null
let Scroll = window.scroll;
let ScrollBy = window.ScrollBy;
let ScrollTo = window.ScrollTo;
let ScrollX = window.scrollX;
let ScrollY = window.scrollY;
let Scrollbars = window.scrollbars;
let personalBar = window.personalbar;
let winResize = window.windowResized;
let viewPort = window.visualViewport = window.visualViewport || {};
let axcell = window.Accelerometer;

let winCssSheet = window.CSSStyleSheet;



console.log('personalBar: ', personalBar);
set.now = (() => { return performance.now || Date.now; });
console.log('wCssownerRule: ');
console.log("set= ", set);
console.log("clientWin", clientWin);
let PerformanceSet = Object.keys(set).toString(); //?
let Start = set.timeOrigin;
let Memory = set.memory;
let maxJs = set.memory.jsHeapSizeLimit;
let usedJs = set.memory.usedJSHeapSize;
let jsTotalSize = set.memory.totalJSHeapSize;
let Leftover = set.jsTotalSize - usedJs;
let cookieLoc = clientWin.cookieEnabled;
let Online = clientWin.onLine;
let sWorker = clientWin.serviceWorker;
let Storage = clientWin.storage;
console.log('Storage: ', Storage);
console.log('sWorker: ', Object.keys(sWorker));
// console.log('Permissions: ',Object.keys( Permissions));
console.log('Online: ', Online);

// need to debug the loading issue created by adding the json
class loadFiles {
    constructor(e) {

        let Script = "./Scripts.json";
        return getScript(Script);

    }


    // Script = (a) => {
    //   for (let file in files) {
    //     let scpt = document.createElement("script");
    //          scpt.language = "javascript";
    //          scpt.type = "text/javascript";
    //          scpt.src = `${a}`;
    //   }
    //   return scpt;
    // }
}
loadScripts = (script) => {
    const ra = Object.keys(script);
    // const Alert=  alert("you are not using key value pairs. please structure your object as a key value pair. if you are not using a json file for your libraries ,load libraries seperatly");
    if (ra.length > 0) {
        for (let i in ra) {
            if (script.css) {
                let Css = script.css;
                for (let c in Css) {
                    let C = `${c}`,
                        ploadC = document.createElement("link");
                    ploadC.id = C;
                    ploadC.href = Css[c];
                    document.head.append(ploadC);
                }
            } else {
                Alert("noCss");
            }
            if (script.js) {
                let Js = script.js;

                for (let j in Js) {
                    let J = `${j}`,
                        ploadJ = document.createElement("script");
                    ploadJ.id = J;
                    ploadJ.src = Js[j];
                    document.head.append(ploadJ);
                }
            } else {
                Alert("noJs");
            }
            return this;
        }
    }
};
async function getScript(sj) {
    const response = await fetch(sj);
    const data = await response.json();
    loadScripts(data.files);
}


// getComputedStyle(document.documentElement)
//     .getPropertyValue('--my-variable-name'); // #999999


// document.addEventListener("DOMContentLoaded", function(event) {



IF = (A, B) => {
    A = (A) ? A : A = B;
    return this.A;
};


windowResized = () => {
    x = Doms.Wrap.styleWidth = innerWidth;
    y = Doms.Wrap.styleHeight = innerHeight - 80;
    Doms.canvas.styleHeight = h;
    Doms.canvas.styleWeight = w;
};
let startNode = 0;
let startOffset = 10;
let endNode = 100;
let endOffset = 110;
let readystate = window.readyState;
var slider1 = document.createElement('input');
slider1.attributes =
    ` type = "range",
  min = 0,
  max = 100,
  value = 20;`;



// var output = document.getElementsByClassName('main');


// var output1 = document.getElementById("rsoutput1");
// var hdinput = document.getElementById("hdinput");

// output.append('slider1');
// hdinput.oninput = function (hdi) {
//   hdi = this.value;
//   
//   return hdi;
// }

// slider.oninput = function (sld) {
//   sld = this.value;
//   output.innerHTML = sld;

// }
// slider1.oninput = function (sld1) {
//   sld1 = this.value;
//   output.innerHTML = sld1;
// }
// })

//?