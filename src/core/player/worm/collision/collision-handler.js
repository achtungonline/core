var EventEmitter = require("events").EventEmitter;
var ShapeToGridConverter = require("./../../../geometry/shape-to-grid-converter.js");
var PlayArea = require("./../../../play-area/play-area.js");

module.exports = function CollisionHandler(playAreaHandler, wormBodyImmunityHandler, mapUtils, shapeSpatialRelations) {
    var events = {};
    events.WORM_MAP_COLLISION = "wormMapCollision";
    events.WORM_WORM_COLLISION = "wormWormCollision";
    events.WORM_POWER_UP_COLLISION = "wormPowerUpCollision";

    var eventEmitter = new EventEmitter();
    var shapeToGridConverter = ShapeToGridConverter.createShapeToGridConverter();

    function wormMapCollisionDetection(gameState, worm) {
        var head = worm.head;
        if (!mapUtils.isInsideMap(gameState.map, head)) {
            eventEmitter.emit(events.WORM_MAP_COLLISION, gameState, worm);
        }
    }

    function wormWormCollisionDetection(gameState, worm) {
        var playArea = gameState.playArea;
        var cells = shapeToGridConverter.convert(worm.head, playArea, ShapeToGridConverter.RoundingModes.CONTAINMENT);
        cells.forEach(function (cell) {
            var value = playArea.grid[cell];
            if (value !== PlayArea.FREE) { // TODO Utility function to check if worm-id
                if (value !== worm.id || !wormBodyImmunityHandler.isImmuneCell(worm, cell)) {
                    eventEmitter.emit(events.WORM_WORM_COLLISION, gameState, worm, value);
                }
            }
        });
    }

    function wormPowerUpCollisionDetection(gameState, worm) {
        var powerUps = gameState.powerUps;
        var collidedPowerUps = [];
        powerUps.forEach(function(powerUp) {
            if(shapeSpatialRelations.intersects(worm.head, powerUp.shape)) {
                collidedPowerUps.push(powerUp);
            }
        });
        collidedPowerUps.forEach(function(powerUp) {
            eventEmitter.emit(events.WORM_POWER_UP_COLLISION, gameState, worm, powerUp);
        });
    }

    return {
        wormMapCollisionDetection: wormMapCollisionDetection,
        wormWormCollisionDetection: wormWormCollisionDetection,
        wormPowerUpCollisionDetection: wormPowerUpCollisionDetection,
        on: eventEmitter.on.bind(eventEmitter),
        events: events
    };
};
