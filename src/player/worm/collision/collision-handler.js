var EventEmitter = require("events").EventEmitter;

module.exports = function CollisionHandler(wormBodyGridHandler, wormBodyImmunityHandler, shapeSpatialRelations, mapUtils) {
    var events = {};
    events.WORM_MAP_COLLISION = "wormMapCollision";
    events.WORM_WORM_COLLISION = "wormWormCollision";

    var eventEmitter = new EventEmitter();


    function wormMapCollisionDetection(gameState, player, worm) {
        var head = worm.head;
        if (!mapUtils.isInsidePlayableArea(gameState.map, head)) {
            eventEmitter.emit(events.WORM_MAP_COLLISION, gameState, player, worm);
        }
    }

    function wormWormCollisionDetection(gameState, player, worm) {
        gameState.players.forEach(function (otherPlayer) {
            otherPlayer.worms.forEach(function (otherWorm) {
                var head = worm.head;
                var wormBodyParts = wormBodyGridHandler.getBodyPartsInProximity(otherWorm, head);
                wormBodyParts.forEach(function (bodyPart) {
                    if (shapeSpatialRelations.intersects(head, bodyPart)) {
                        if (!wormBodyImmunityHandler.isImmuneToBodyPart(worm, bodyPart)) {
                            eventEmitter.emit(events.WORM_WORM_COLLISION, gameState, player, worm, otherWorm);
                        }
                    }
                });
            });
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
