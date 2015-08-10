module.exports = function Game(gameEngine, eventHandler, playerHandler, map, players) {

    eventHandler.on(eventHandler.events.GAME_ROUND_PHASE_STARTED, function (phaseType) {
        console.log("Phase: " + phaseType + " started");
    });

    eventHandler.on(eventHandler.events.GAME_OVER, function () {
        console.log("Game Over");
    });

    eventHandler.on(eventHandler.events.PLAYER_DIED, function (players, player) {
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
        on: eventHandler.on,
        setPlayerSteering: setPlayerSteering,
        setAIPlayer: setAIPlayer,
        removeAIPlayer: removeAIPlayer,
        pause: pause
    };
};