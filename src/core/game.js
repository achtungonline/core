module.exports = function Game(gameState, phaseHandler, aiHandler) {

    function start() {
        gameState.gameActive = true;
        phaseHandler.start(gameState);
    }

    function stop() {
        gameState.gameActive = false;
    }

    function update(deltaTime) {
        if (isActive(gameState) && deltaTime > 0) {
            gameState.gameTime += deltaTime;
            aiHandler.update(gameState, deltaTime);
            phaseHandler.update(gameState, deltaTime);

            if(gameState.phase === "roundOverPhase") {
                stop(gameState);
            }
        }
    }

    function isActive() {
        return gameState.gameActive;
    }

    return {
        gameState,
        start,
        stop,
        isActive,
        update
    };
};
