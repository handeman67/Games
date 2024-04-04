class point {
    constructor(_x, _y) {
        this.x = _x;
        this.y = _y;
    }

show(){
    beginPath();
    stroke(0);
    fill(360, 50, 200);
    arc(this.x, this.y, size, 0, 2 * Math.PI, true);

}
add(vectore) {
    return new Vector(this.x += vector.x, this.y += vector.y);

}
subtract(vector) {
    return new Vector(this.x -= vector.x, this.y -= vector.y);
}
multiply(multiplier) {
    return new Vector(this.x *= multiplier, this.y *= multiplier);
}
length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
}
cross(vector) {
    return this.x * vector.y - this.y * vector.x;
}
dot(vector) {
    return this.x * vector.x + this.y * vector.y;
}}