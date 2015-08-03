var intersectFunctions = require("./shape-spatial-relations.js");

module.exports = function ShapeModifier() {
    function move(shape, xDiff, yDiff) {
        shape.x += xDiff;
        shape.y += yDiff;
        shape.centerX += xDiff;
        shape.centerY += yDiff;
        shape.maxX += xDiff;
        shape.maxY += yDiff;
    }

    function setPosition(shape, newX, newY) {
        var xDiff = newX - shape.x;
        var yDiff = newY - shape.y;
        move(shape, xDiff, yDiff);
    }

    return {
        move: move,
        setPosition: setPosition
    };
};