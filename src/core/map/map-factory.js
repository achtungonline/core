var ShapeFactory = require("./../geometry/shape-factory.js");
var Map = require("./map.js");

module.exports = function MapFactory() {
    var shapeFactory = ShapeFactory();

    function create(shape, blockingShapes) {
        return Map(shape, blockingShapes);
    }

    function createRectangle(width, height, blockingShapes) {
        var rectangle = shapeFactory.createRectangle(width, height, 0, 0);
        return Map(rectangle, blockingShapes);
    }

    function createSquare(size, blockingShapes) {
        return createRectangle(size, size, blockingShapes);
    }

    function createCircle(size, blockingShapes) {
        return Map(shapeFactory.createCircle(size / 2, 0, 0), blockingShapes);
    }

    return {
        create: create,
        createSquare: createSquare,
        createRectangle: createRectangle,
        createCircle: createCircle
    };
};