var ShapeFactory = require("./../geometry/shape-factory.js");
var Map = require("./map.js");
var Zone = require("./zone.js");

module.exports = function MapFactory() {
    var shapeFactory = ShapeFactory();

    function createRectangle(width, height) {
        var rectangle = shapeFactory.createRectangle(width, height, 0, 0);
        var zone = Zone(rectangle, false);
        var zones = [zone];
        return Map(zones);
    }

    function createSquare(size) {
        return createRectangle(size, size);
    }

    return {
        createSquare: createSquare,
        createRectangle: createRectangle
    };
};