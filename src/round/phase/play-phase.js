var playPhase = module.exports = {};

playPhase.type = "playPhase";

playPhase.PlayPhase = function PlayPhase(wormHandler, playerHandler, playerUtils) {

    playerHandler.on(playerHandler.events.PLAYER_DIED, function onPlayerDied(gameState, player) {
        var alivePlayers = playerUtils.getAlivePlayers(gameState.players);

        if (alivePlayers.length <= 1) {
            gameState.phaseTimer = -1;
        }
    });

    function start(gameState) {
        gameState.phaseTimer = 1;
    }

    function update(gameState, deltaTime) {
        if (!isActive(gameState)) {
            return;
        }

        playerUtils.forEachAliveWorm(gameState.players, function (player, worm) {
            wormHandler.update(gameState, deltaTime, player, worm);
        });

    }

    function isActive(gameState) {
        return gameState.phaseTimer > 0;
    }

    return {
        type: playPhase.type,
        start: start,
        update: update,
        isActive: isActive
    };
};


