module.exports = function WormHandler(shapeHandler) {
    function updateWorm(deltaTime, worm) {
        var xDiff = Math.cos(worm.direction) * worm.speed * deltaTime;
        var yDiff = Math.sin(worm.direction) * worm.speed * deltaTime;

        shapeHandler.move(worm.head, xDiff, yDiff);
    }

    return {
        updateWorm: updateWorm
    };
};