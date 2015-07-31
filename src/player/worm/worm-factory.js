var Worm = require("./worm.js");
var ShapeFactory = require("./../../geometry/shape-factory.js");
var Clone = require("./../../util/clone.js");

var WORM_RADIUS = 10;
var WORM_SPEED = 30;

module.exports = function WormFactory(idGenerator) {
    var shapeFactory = ShapeFactory();

    function create() {
        return Worm(idGenerator(), shapeFactory.createCircle(WORM_RADIUS, 10, 10), 0, WORM_SPEED);
    }

    return {
        create: create,
    }
}