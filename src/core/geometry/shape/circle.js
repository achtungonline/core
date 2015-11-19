var Shape = require("./shape.js");

var circleShape = module.exports = {};

circleShape.type = 1;

circleShape.Circle = function(radius, x, y) {
    var area = Math.PI * radius * radius;
    var shape = Shape(circleShape.type, radius * 2, radius * 2, x, y, area);

    shape.radius = radius;
    return shape;
};
