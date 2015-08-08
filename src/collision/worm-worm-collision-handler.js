module.exports = function WormWormCollisionHandler(eventHandler, wormHandler, shapeSpatialRelations) {

    function collisionDetection(players, player, worm, otherWorm) {
        var head = worm.head;
        var collided = false;
        var wormBodyParts = wormHandler.getBodyPartsInProximity(otherWorm, head);
        wormBodyParts.forEach(function (bodyPart) {
            if (shapeSpatialRelations.intersects(head, bodyPart)) {
                if (!wormHandler.isImmuneToBodyPart(worm, bodyPart)) {
                    collided = true;
                }
            }
        });
        if (collided) {
            eventHandler.emit(eventHandler.events.WORM_WORM_COLLISION, players, player, worm, otherWorm);
        }

    }

    return {collisionDetection: collisionDetection}
};