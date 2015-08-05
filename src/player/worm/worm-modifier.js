module.exports = function WormModifier(shapeRelocater, wormBodyModifier, clone) {

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

        shapeRelocater.move(worm.head, xDiff, yDiff);
    }


    return {
        updateDirection: updateDirection,
        updatePosition: updatePosition,
        createAndPushNextBodyPart: createAndPushNextBodyPart
    }
}

