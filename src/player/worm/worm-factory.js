var Worm = require("./worm.js");
var ShapeFactory = require("./../../geometry/shape-factory.js");

var WORM_RADIUS = 2;
var WORM_SPEED = 50;
var TURNING_SPEED = 1.75;

module.exports = function WormFactory(idGenerator) {
    var shapeFactory = ShapeFactory();

    function create(playerId) {
        var args = {
            id: idGenerator(),
            playerId: playerId,
            head: shapeFactory.createCircle(WORM_RADIUS, 10, 10),
            direction: 0,
            speed: WORM_SPEED,
            turningSpeed: TURNING_SPEED,
            alive: true
        };
        return Worm(args);
    }

    return {
        create: create
    };
};