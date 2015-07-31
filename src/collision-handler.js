module.exports = function CollisionHandler(eventHandler, mapUtils) {
    eventHandler.register(eventHandler.events.WORM_MAP_COLLISION);

    function wormMapCollisionDetection(players, player, worm, map) {
        var head = worm.head;
        if (!mapUtils.isInsidePlayableArea(map, head)) {
            eventHandler.emit(eventHandler.events.WORM_MAP_COLLISION, players, player, worm, map);
        }
    }

    function wormWormCollisionDetection(player) {
        //    TODO
    }

    function wormPowerUpCollisionDetection(player) {
        //    TODO
    }

    return {
        wormMapCollisionDetection: wormMapCollisionDetection
    }
}
