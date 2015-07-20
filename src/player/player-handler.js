module.exports = function PlayerHandler(shapeHandler) {
    function update(deltaTime, players) {
        players.forEach(function (player) {
            player.worms.forEach(function (worm) {
                var xDiff = Math.cos(worm.direction) * worm.speed * deltaTime;
                var yDiff = Math.sin(worm.direction) * worm.speed * deltaTime;

                shapeHandler.move(worm.head, xDiff, yDiff);
            });
        });
    }

    return {
        update: update
    };
};