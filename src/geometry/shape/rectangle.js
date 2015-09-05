var Shape = require("./shape.js");

var rectangleShape = module.exports = {};

rectangleShape.type = 0;

rectangleShape.Rectangle = function(width, height, x, y) {
    var area = width * height;
    var shape = Shape(rectangleShape.type, width, height, x, y, area);

    shape.width = width;
    shape.height = height;
    return shape;
};