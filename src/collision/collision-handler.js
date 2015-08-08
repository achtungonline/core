module.exports = function CollisionHandler(eventHandler, wormWormCollisionHandler, mapUtils) {

    function wormMapCollisionDetection(players, player, worm, map) {
        var head = worm.head;
        if (!mapUtils.isInsidePlayableArea(map, head)) {
            eventHandler.emit(eventHandler.events.WORM_MAP_COLLISION, players, player, worm, map);
        }
    }

    function wormWormCollisionDetection(players, player, worm, otherWorm) {
        wormWormCollisionHandler.collisionDetection(players, player, worm, otherWorm);
    }

    function wormPowerUpCollisionDetection(player) {
        //    TODO
    }

    return {
        wormMapCollisionDetection: wormMapCollisionDetection,
        wormWormCollisionDetection: wormWormCollisionDetection
    }
}
