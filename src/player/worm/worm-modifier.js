module.exports = function WormModifier(eventHandler, shapeModifier, clone) {
    eventHandler.register(eventHandler.WORM_BODY_ADDED);

    function addBodyPart(worm) {
        var bodyPart = clone(worm.head);
        worm.body.push(bodyPart);
        eventHandler.emit(eventHandler.WORM_BODY_ADDED, worm, bodyPart)
    }

    function updateDirection(deltaTime, player, worm) {
        worm.direction += player.steering * deltaTime;
    }

    function updatePosition(deltaTime, worm) {
        var xDiff = Math.cos(worm.direction) * worm.speed * deltaTime;
        var yDiff = Math.sin(worm.direction) * worm.speed * deltaTime;

        shapeModifier.move(worm.head, xDiff, yDiff);
        addBodyPart(worm);
    }

    return {
        updateDirection: updateDirection,
        updatePosition: updatePosition
    }
}

