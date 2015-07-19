var updater = module.exports = {};

updater.players = function(deltaTime, players, shapeHandler) {
    players.forEach(function (player) {
        player.worms.forEach(function (worm) {
            var xDiff = Math.cos(worm.direction) * worm.speed * deltaTime;
            var yDiff = Math.sin(worm.direction) * worm.speed * deltaTime;

            shapeHandler.move(worm.head, xDiff, yDiff);
        });
    });
}
