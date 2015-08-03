module.exports = function WormModifier(shapeModifier, clone) {

    function generateAndAddBodyPart(worm) {
        var bodyPart = clone(worm.head);
        worm.body.push(bodyPart);
        return bodyPart;
    }

    function updateDirection(deltaTime, player, worm) {
        worm.direction += player.steering * worm.turningSpeed * deltaTime;
    }

    function updateHeadPosition(deltaTime, worm) {
        var xDiff = Math.cos(worm.direction) * worm.speed * deltaTime;
        var yDiff = Math.sin(worm.direction) * worm.speed * deltaTime;

        shapeModifier.move(worm.head, xDiff, yDiff);
    }


    return {
        updateDirection: updateDirection,
        updatePosition: updateHeadPosition,
        generateAndAddBodyPart: generateAndAddBodyPart,
    }
}

