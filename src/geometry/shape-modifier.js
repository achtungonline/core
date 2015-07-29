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

    return {
        move: move
    };
};