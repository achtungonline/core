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

    function setPlayerSteering(player, steering) {
        playerHandler.setSteering(player, steering);
    }

    function pause() {
        if (!gameEngine.isActive()) {
            throw Error("Trying to pause a game that is not running");
        }
        gameEngine.pause(gameState);
    }

    function resume() {
        if(!gameEngine.isActive()) {
            throw Error("Trying to resume a game that is not running");
        }
        gameEngine.resume(gameState);
    }

    return {
        gameState: gameState,
        start: start,
        setPlayerSteering: setPlayerSteering,
        pause: pause,
        resume: resume,
        on: gameEngine.on.bind(gameEngine),
        events: gameEngine.events
    };
};