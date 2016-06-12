var ShapeFactory = require("./../geometry/shape-factory.js");
var Map = require("./map.js");

module.exports = function MapFactory() {
    var shapeFactory = ShapeFactory();

    function create(options) {
        return Map(options);
    }

    function createRectangle(options) {
        var rectangle = shapeFactory.createRectangle(options.width, options.height, 0, 0);
        return Map({name: options.name, shape: rectangle, blockingShapes: options.blockingShapes});
    }

    function createSquare(options) {
        return createRectangle({name: options.name, width: options.size, height: options.size, blockingShapes: options.blockingShapes});
    }

    function createCircle(options) {
        return Map({name: options.name, shape: shapeFactory.createCircle(options.size / 2, 0, 0), blockingShapes: options.blockingShapes});
    }

    return {
        create: create,
        createSquare: createSquare,
        createRectangle: createRectangle,
        createCircle: createCircle
    };
};