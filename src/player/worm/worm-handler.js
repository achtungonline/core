module.exports = function WormHandler(wormModifier, wormBodyGridHandler) {

    function updateDirection(deltaTime, player, worm) {
        wormModifier.updateDirection(deltaTime, player, worm);
    }

    function updatePosition(deltaTime, worm) {
        wormModifier.updatePosition(deltaTime, worm);
        var wormBody = wormModifier.generateAndAddBodyPart(worm);
        wormBodyGridHandler.addBodyPart(worm, wormBody);
    }

    return {
        updateDirection: updateDirection,
        updatePosition: updatePosition
    }
}