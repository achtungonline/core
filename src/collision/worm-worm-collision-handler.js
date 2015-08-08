module.exports = function WormWormCollisionHandler(eventHandler, wormHandler, shapeSpatialRelations) {

    function collisionDetection(players, player, worm, otherWorm) {
        var head = worm.head;
        var wormBodyParts = wormHandler.getBodyPartsInProximity(otherWorm, head);
        wormBodyParts.forEach(function (bodyPart) {
            if (shapeSpatialRelations.intersects(head, bodyPart)) {
                if (!wormHandler.isImmuneToBodyPart(worm, bodyPart)) {
                    eventHandler.emit(eventHandler.events.WORM_WORM_COLLISION, players, player, worm)
                }
            }
        });
    }

    return {collisionDetection: collisionDetection}
}