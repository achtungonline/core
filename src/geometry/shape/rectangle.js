var Shape = require("./shape.js");

module.exports = function Rectangle(width, height, x, y) {
    var area = width * height;
    var shape = Shape("rectangle", width, height, x, y, area);

    shape.width = width;
    shape.height = height;
    return shape;
}