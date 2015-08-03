var Worm = require("./worm.js");
var ShapeFactory = require("./../../geometry/shape-factory.js");
var Clone = require("./../../util/clone.js");

var WORM_RADIUS = 2;
var WORM_SPEED = 50;
var TURNING_SPEED = 1.75;

module.exports = function WormFactory(idGenerator) {
    var shapeFactory = ShapeFactory();

    function create() {
        return Worm(idGenerator(), shapeFactory.createCircle(WORM_RADIUS, 10, 10), 0, WORM_SPEED, TURNING_SPEED);
    }

    return {
        create: create,
    }
}