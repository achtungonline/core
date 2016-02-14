module.exports = function Game(gameState, gameEngine, playerHandler) {

    gameEngine.on(gameEngine.events.GAME_OVER, function () {
        console.log("Game Over");
    });

    playerHandler.on(playerHandler.events.PLAYER_DIED, function (gameState, player) {
        console.log("Player Died: " + player.id);
    });

    function start() {
        gameEngine.start(gameState);
    }

    function stop() {
        gameEngine.stop(gameState);
    }

    function update(deltaTime) {
        gameEngine.update(gameState, deltaTime);
    }

    function setPlayerSteering(player, steering) {
        playerHandler.setSteering(player, steering);
    }

    function isGameOver() {
        return gameState.phase === "roundOverPhase";
    }
    return {
        gameState: gameState,
        start: start,
        stop: stop,
        isActive: gameEngine.isActive.bind(null, gameState),
        isGameOver: isGameOver,
        update: update,
        setPlayerSteering: setPlayerSteering,
        on: gameEngine.on.bind(gameEngine),
        events: gameEngine.events
    };
};
