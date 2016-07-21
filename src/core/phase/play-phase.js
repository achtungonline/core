var playPhase = module.exports = {};

playPhase.type = "playPhase";

playPhase.PlayPhase = function PlayPhase(deps) {

    deps.playerHandler.on(deps.playerHandler.events.PLAYER_DIED, function onPlayerDied(gameState, player) {
        var alivePlayers = deps.playerUtils.getAlivePlayers(gameState.players);

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

        deps.powerUpHandler.update(deltaTime, gameState);
        deps.effectHandler.update(deltaTime, gameState);
        deps.playerHandler.update(gameState, deltaTime);
        deps.playerUtils.forEachAliveWorm(gameState.worms, function (worm) {
            deps.wormHandler.update(gameState, deltaTime, worm);
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


