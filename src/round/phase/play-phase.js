var playPhase = module.exports = {};

playPhase.type = "playPhase";

playPhase.PlayPhase = function PlayPhase(wormHandler, playerHandler, playerUtils) {
    var type = playPhase.type;
    var run;

    playerHandler.on(playerHandler.events.PLAYER_DIED, function onPlayerDied(gameState, player) {
        var alivePlayers = playerUtils.getAlivePlayers(gameState.players);

        if (alivePlayers.length <= 1) {
            run = false;

        }
    });

    function start() {
        run = true;
    }

    function update(gameState, deltaTime) {
        if (!isRunning()) {
            return;
        }

        playerUtils.forEachAliveWorm(gameState.players, function (player, worm) {
            wormHandler.update(gameState, deltaTime, player, worm);
        });

    }

    function isRunning() {
        return run;
    }

    return {
        type: type,
        start: start,
        update: update,
        isRunning: isRunning
    };
};


