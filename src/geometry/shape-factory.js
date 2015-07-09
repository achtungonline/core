var Circle = require("./shape/circle.js");
var Rectangle = require("./shape/rectangle.js");

module.exports = function ShapeFactory() {

    var createSquare = function (size, x, y) {
        Rectangle(size, size, x, y)
    }

    return {
        createRectangle: Rectangle,
        createSquare: createSquare,
        createCircle: Circle
    };
};
