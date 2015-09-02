var EventEmitter = require("events").EventEmitter;
var ShapeToGridConverter = require("./../../../geometry/shape-to-grid-converter.js");
var PlayArea = require("./../../../play-area/play-area.js");

module.exports = function CollisionHandler(playAreaHandler, wormBodyImmunityHandler, mapUtils) {
    var events = {};
    events.WORM_MAP_COLLISION = "wormMapCollision";
    events.WORM_WORM_COLLISION = "wormWormCollision";

    var eventEmitter = new EventEmitter();
    var shapeToGridConverter = ShapeToGridConverter.createShapeToGridConverter();

    function wormMapCollisionDetection(gameState, player, worm) {
        var head = worm.head;
        if (!mapUtils.isInsidePlayableArea(gameState.map, head)) {
            eventEmitter.emit(events.WORM_MAP_COLLISION, gameState, player, worm);
        }
    }

    function wormWormCollisionDetection(gameState, player, worm) {
        var playArea = gameState.playArea;
        var cells = shapeToGridConverter.convert(worm.head, playArea, ShapeToGridConverter.RoundingModes.INSIDE);
        cells.forEach(function (cell) {
            var value = playAreaHandler.getCellValue(playArea, cell);
            if (value !== PlayArea.FREE) { // TODO Utility function to check if worm-id
                if (value !== worm.id || !wormBodyImmunityHandler.isImmuneToBodyPart(worm, cell)) {
                    eventEmitter.emit(events.WORM_WORM_COLLISION, gameState, player, worm, value);
                }
            }
        });
    }

    function wormPowerUpCollisionDetection(player) {
        //    TODO
    }

    return {
        wormMapCollisionDetection: wormMapCollisionDetection,
        wormWormCollisionDetection: wormWormCollisionDetection,
        on: eventEmitter.on.bind(eventEmitter),
        events: events
    }
};
