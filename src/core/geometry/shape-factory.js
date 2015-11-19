var Circle = require("./shape/circle.js").Circle;
var Rectangle = require("./shape/rectangle.js").Rectangle;

module.exports = function ShapeFactory() {

    var createSquare = function (size, x, y) {
        return Rectangle(size, size, x, y);
    };

    return {
        createRectangle: Rectangle,
        createSquare: createSquare,
        createCircle: Circle
    };
};
