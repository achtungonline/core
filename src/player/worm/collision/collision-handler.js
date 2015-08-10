var EventEmitter = require("events").EventEmitter;

module.exports = function CollisionHandler(wormBodyGridHandler, wormBodyImmunityHandler, shapeSpatialRelations, mapUtils) {
    var events = {};
    events.WORM_MAP_COLLISION = "wormMapCollision";
    events.WORM_WORM_COLLISION = "wormWormCollision";

    var eventEmitter = new EventEmitter();


    function wormMapCollisionDetection(players, player, worm, map) {
        var head = worm.head;
        if (!mapUtils.isInsidePlayableArea(map, head)) {
            eventEmitter.emit(events.WORM_MAP_COLLISION, players, player, worm, map);
        }
    }

    function wormWormCollisionDetection(players, player, worm) {
        players.forEach(function (otherPlayer) {
            otherPlayer.worms.forEach(function (otherWorm) {
                var head = worm.head;
                var wormBodyParts = wormBodyGridHandler.getBodyPartsInProximity(otherWorm, head);
                wormBodyParts.forEach(function (bodyPart) {
                    if (shapeSpatialRelations.intersects(head, bodyPart)) {
                        if (!wormBodyImmunityHandler.isImmuneToBodyPart(worm, bodyPart)) {
                            eventEmitter.emit(events.WORM_WORM_COLLISION, players, player, worm, otherWorm);
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
