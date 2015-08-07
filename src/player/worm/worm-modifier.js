module.exports = function WormModifier(shapeModifierI, wormBodyModifier, clone) {

    function createAndPushNextBodyPart(worm) {
        var bodyPart = clone(worm.head);
        wormBodyModifier.pushBodyPart(worm, bodyPart);
        return bodyPart;
    }

    function updateDirection(deltaTime, player, worm) {
        var direction = worm.direction + player.steering * worm.turningSpeed * deltaTime;
        setDirection(worm, direction);
    }

    function updatePosition(deltaTime, worm) {
        var xDiff = Math.cos(worm.direction) * worm.speed * deltaTime;
        var yDiff = Math.sin(worm.direction) * worm.speed * deltaTime;

        setHead(worm, shapeModifierI.move(worm.head, xDiff, yDiff));
    }

    function setHead(worm, shape) {
        worm.head = shape;
    }

    function setDirection(worm, direction) {
        worm.direction = direction;
    }

    return {
        setDirection: setDirection,
        setHead: setHead,
        updateDirection: updateDirection,
        updatePosition: updatePosition,
        createAndPushNextBodyPart: createAndPushNextBodyPart
    }
}

