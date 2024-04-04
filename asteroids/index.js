window.onload = function() {
    const links = [
        "https://fonts.googleapis.com/icon?family=Material+Icons",
        "https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css",
        "css/main.css"

    ]
    const Fl = [
        // "https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js",
        // "https://code.getmdl.io/1.3.0/material.min.js",
       
        "js/gameReset.js",
         "js/gamOver.js",
        "js/controls.js",
        "js/astroid.js",
        "js/ships.js",
        "js/P.js",
        "js/laser.js",
        "js/levels.js",
       
 "js/js.js",

    ];

    let head = document.getElementsByTagName('head')[0];
    let body = document.getElementsByTagName('body')[0]
    for (let i = 0; i < Fl.length; i++) {
        let Spt = document.createElement('script');
        Spt.language = "javascript";
        Spt.src = Fl[i]
        head.appendChild(Spt);
    }
    for (let j = 0; j < links.length; j++) {
        let lnk = document.createElement('link');
        lnk.type = "text / css";
        lnk.rel = "stylesheet";
        lnk.href = links[j];
        head.appendChild(lnk);
    };
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
