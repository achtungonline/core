var intersectFunctions = require("./shape-intersect-functions.js");

module.exports = function ShapeHandler() {
    function move(shape, xDiff, yDiff) {
        shape.x += xDiff;
        shape.y += yDiff;
        shape.centerX += xDiff;
        shape.centerY += yDiff;
        shape.maxX += xDiff;
        shape.maxY += yDiff;
    }

    function intersects(shape, otherShape) {
        var intersectFunction = intersectFunctions[intersectFunctions.getIntersectFunctionName(shape.type, otherShape.type)];
        if (intersectFunction === undefined || intersectFunction === null) {
            throw Error("No intersection function found between shapes: " + shape.type + " and " + otherShape.type);
        }
        return intersectFunction(shape, otherShape);
    }

    return {
        move: move,
        intersects: intersects
    };
}
;