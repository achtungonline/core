var clone = require("./util/clone.js");

module.exports = function CoordinateShapeFactory() {
    return {
        create: function(x, y, shape) {
            var coordinateShape = clone(shape);
            coordinateShape.x = x;
            coordinateShape.y = y;
            coordinateShape.maxX = x + shape.boundingBox.width;
            coordinateShape.maxY = y + shape.boundingBox.height;
            return coordinateShape;
        }
    }
};