const IF = (A, B) => {
    A = (A) ? A : A = B;
    return A;
};
const lasercount = 2;

function Can(w, h) {
    canvas = createCanvas(w, h, "2d");
    canvas.parent("can2");
    colorMode(HSB, 360, 100, 100);
    bg = color(30, 80, 80, 1);
    document.getElementById("can2").style = `position:"relative";border:2px solid darkgreen;margin: 0 auto;`;
    document.addEventListener(
        "touchstart",
        function() {
            return false;
        },
        false
    );

    //Keyboard Fire Mechinism
    keyPressed = () => {
        if (keyCode === (96)) {
            if (lasers.length >= lasercount) {
                return;
            }

            lasers.push(new Laser(player[0].pos, 5, 5));
        }
        return;
    };
}