var ShapeFactory = require("./../geometry/shape-factory.js");
var Map = require("./map.js");

module.exports = function MapFactory() {
    var shapeFactory = ShapeFactory();

    function create(shape, blockingShapes) {
        return Map(shape, blockingShapes);
    }

    function createRectangle(width, height) {
        var rectangle = shapeFactory.createRectangle(width, height, 0, 0);
        return Map(rectangle);
    }

    function createSquare(size) {
        return createRectangle(size, size);
    }

    return {
        create: create,
        createSquare: createSquare,
        createRectangle: createRectangle
    };
};