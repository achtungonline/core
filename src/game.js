module.exports = function Game(gameEngine, eventHandler, playerModifier, map, players) {

    eventHandler.on(eventHandler.events.GAME_ROUND_PHASE_STARTED, function(phaseType) {
       console.log("Phase: " + phaseType + " started");
    });

    eventHandler.on(eventHandler.events.GAME_OVER, function() {
       console.log("Game Over");
    });

    function start() {
        gameEngine.start(players, map);
    }

    function on(event, listener) {

        if (!eventHandler.isRegistered(event)) {
            throw Error("Invalid event: " + event);
        }

        eventHandler.on(event, listener);
    }

    function setPlayerSteering(player, steering) {
        playerModifier.setSteering(player, steering);
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
        on: on,
        setPlayerSteering: setPlayerSteering,
        pause: pause
    };
};