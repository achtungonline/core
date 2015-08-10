module.exports = function Game(gameEngine, playerHandler, map, players) {

    gameEngine.on(gameEngine.events.GAME_OVER, function () {
        console.log("Game Over");
    });

    playerHandler.on(playerHandler.events.PLAYER_DIED, function (players, player) {
        console.log("Player Died: " + player.id);
    });

    function start() {
        gameEngine.start(players, map);
    }

    function setPlayerSteering(player, steering) {
        playerHandler.setSteering(player, steering);
    }

    function setAIPlayer(player, ai) {
        playerHandler.setAIPlayer(player, ai);
    }

    function removeAIPlayer(player) {
        playerHandler.removeAIPlayer(player);
    }

    function pause() {
        if (!gameEngine.isRunning()) {
            throw Error("Trying to pause a game that is not running");
        }
        gameEngine.pause();
    }

    return {
        map: map,
        players: players,
        start: start,
        setPlayerSteering: setPlayerSteering,
        setAIPlayer: setAIPlayer,
        removeAIPlayer: removeAIPlayer,
        pause: pause,
        on: gameEngine.on.bind(gameEngine),
        events: gameEngine.events
    };
};