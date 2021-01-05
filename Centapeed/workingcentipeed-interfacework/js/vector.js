var point = function(_x, _y) {
    this.x = _x;
    this.y = _y;
};
this.show = () => {
    beginPath();
    stroke(0);
    fill(360, 50, 200);
    arc(this.x, this.y, size, 0, 2 * Math.PI, true);

};
this.add = function(vectore) {
    return new Vector(this.x += vector.x, this.y += vector.y);

};
this.subtract = function(vector) {
    return new Vector(this.x -= vector.x, this.y -= vector.y);
};
this._.multiply = function(multiplier) {
    return new Vector(this.x *= multiplier, this.y *= multiplier);
};
this.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};
this.cross = function(vector) {
    return this.x * vector.y - this.y * vector.x;
};
this.dot = function(vector) {
    return this.x * vector.x + this.y * vector.y;


};