
module.exports = function WormModifier(shapeModifierI, wormBodyModifier, wormBodyImmunityHandler, clone) {

    function createAndPushNextBodyPart(worm) {
        var bodyPart = clone(worm.head);
        wormBodyModifier.pushBodyPart(worm, bodyPart);
        return bodyPart;
    }

    function updateDirection(deltaTime, player, worm) {
        worm.direction += player.steering * worm.turningSpeed * deltaTime;
    }

    function updatePosition(deltaTime, worm) {
        var xDiff = Math.cos(worm.direction) * worm.speed * deltaTime;
        var yDiff = Math.sin(worm.direction) * worm.speed * deltaTime;

        worm.head = shapeModifierI.move(worm.head, xDiff, yDiff);

        wormBodyImmunityHandler.update(worm);
    }


    return {
        updateDirection: updateDirection,
        updatePosition: updatePosition,
        createAndPushNextBodyPart: createAndPushNextBodyPart
    }
};

