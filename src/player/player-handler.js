module.exports = function PlayerHandler(wormHandler) {
    function updatePlayer(deltaTime, player) {
        player.worms.forEach(function (worm) {
            wormHandler.updateWorm(deltaTime, worm);
        });
    }

    return {
        updatePlayer: updatePlayer
    };
};