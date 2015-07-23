module.exports = function PlayerHandler(wormHandler) {

    function updateDirection(deltaTime, player) {
        player.worms.forEach(function (worm) {
            worm.direction += player.steering * deltaTime;
        });
    }

    function updatePlayer(deltaTime, player) {
        updateDirection(deltaTime, player);

        player.worms.forEach(function (worm) {
            wormHandler.updateWorm(deltaTime, worm);
        });
    }

    function setSteering(player, steering) {
        player.steering = steering;
    }

    return {
        updatePlayer: updatePlayer,
        setSteering: setSteering
    };
};