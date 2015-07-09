var Shape = require("./shape.js");

module.exports = function Circle(radius, x, y) {
    var area = Math.PI * radius * radius;
    var shape = Shape("circle", radius * 2, radius * 2, x, y, area);

    shape.radius = radius;
    return shape;
}