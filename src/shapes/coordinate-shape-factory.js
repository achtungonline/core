var clone = require("./../util/clone.js");
var ShapeFactory = require("./shape-factory.js");

module.exports = function CoordinateShapeFactory() {
    var shapeFactory = ShapeFactory();

    var createCoordShape = function(shape, x, y) {
        var coordinateShape = clone(shape);
        coordinateShape.x = x;
        coordinateShape.y = y;
        coordinateShape.maxX = x + shape.boundingBox.width;
        coordinateShape.maxY = y + shape.boundingBox.height;
        coordinateShape.centerX = x + shape.boundingBox.width / 2;
        coordinateShape.centerY = y + shape.boundingBox.height / 2;
        return coordinateShape;
    }

    return {
        create: createCoordShape,
        createCircle: function(radius, x, y) {
            return createCoordShape(shapeFactory.createCircle(radius), x, y);
        },
        createRectangle: function(width, height, x, y) {
            return createCoordShape(shapeFactory.createRectangle(width, height), x, y);
        },
        createSquare: function(size, x, y) {
            return createCoordShape(shapeFactory.createSquare(size), x, y);
        }
    }
};