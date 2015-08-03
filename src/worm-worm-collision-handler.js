module.exports = function WormWormCollisionHandler(eventHandler, wormBodyGridHandler, shapeSpatialRelations) {
    eventHandler.register(eventHandler.events.WORM_WORM_COLLISION);
    function collisionDetection(players, player, worm, otherWorm) {
        var head = worm.head;
        var wormBodyGrid = wormBodyGridHandler.getWormBodyGrid(otherWorm);
        var cells = wormBodyGridHandler.getIntersectingCells(wormBodyGrid, head);
        cells.forEach(function (cell) {
            cell.forEach(function (bodyPart) {
                if (shapeSpatialRelations.intersects(head, bodyPart)) {
                    eventHandler.emit(eventHandler.events.WORM_WORM_COLLISION, players, player, worm)
                }
            });
        });
    }

    return {collisionDetection: collisionDetection}
}