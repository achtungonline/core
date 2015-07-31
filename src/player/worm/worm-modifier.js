module.exports = function WormModifier(shapeModifier, clone) {

    function updateDirection(deltaTime, player, worm) {
        worm.direction += player.steering * deltaTime;
    }

    function updatePosition(deltaTime, worm) {
        var xDiff = Math.cos(worm.direction) * worm.speed * deltaTime;
        var yDiff = Math.sin(worm.direction) * worm.speed * deltaTime;

        shapeModifier.move(worm.head, xDiff, yDiff);

        worm.body.push(clone(worm.head));
    }

    return {
        updateDirection: updateDirection,
        updatePosition: updatePosition
    }
}

