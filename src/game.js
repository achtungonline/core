module.exports = function Game(gameState, gameEngine, playerHandler, playAreaHandler) {

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
        if (!gameEngine.isRunning()) {
            throw Error("Trying to pause a game that is not running");
        }
        gameEngine.pause();
    }

    return {
        gameState: gameState,
        getPlayAreaUpdateBuffer : playAreaHandler.getUpdateBuffer,
        start: start,
        setPlayerSteering: setPlayerSteering,
        pause: pause,
        on: gameEngine.on.bind(gameEngine),
        events: gameEngine.events
    };
};