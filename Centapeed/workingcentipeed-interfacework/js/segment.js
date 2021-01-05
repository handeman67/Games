class segment {
    constructor(x1, y1, vecx, vecy) {
        const t = this;
        t.x = x;
        t.y = y;
        t.vecx = vecx;
        t.vecy = vecy;
        t.show = function(width, color) {
            beginPath();
            lineWidth = width;
            moveTo(t.x, this.y);
            lineTo(t.x + vecx, t.y * vecy);
            stroke(color);
            strokeWeight(12);
        };
    }
}