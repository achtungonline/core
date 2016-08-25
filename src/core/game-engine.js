var EventEmitter = require("events").EventEmitter;
var events = require("./game-engine-events");

module.exports = function GameEngine(phaseHandler, playAreaHandler) {
    var eventEmitter = new EventEmitter();
    phaseHandler.on(phaseHandler.events.NEW_PHASE_STARTED, function (phaseType, gameState) {
        eventEmitter.emit(events.NEW_PHASE_STARTED, phaseType);
        if(phaseType === "roundOverPhase") {
            stop(gameState);
        }
    });

    function start(gameState) {
        gameState.gameActive = true;
        phaseHandler.start(gameState);
    }

    function stop(gameState) {
        if (gameState.gameActive) {
            gameState.gameActive = false;
            eventEmitter.emit(events.GAME_OVER, gameState);
        }
    }

    function update(gameState, deltaTime) {
        if (isActive(gameState) && deltaTime > 0) {
            gameState.gameTime += deltaTime;
            eventEmitter.emit(events.GAME_UPDATE_STARTING, gameState, deltaTime);
            phaseHandler.update(gameState, deltaTime);

            if (isActive(gameState)) {
                eventEmitter.emit(events.GAME_UPDATED, gameState, deltaTime);
            } else {
                stop(gameState);
            }
        }
    }

    function isActive(gameState) {
        return gameState.gameActive;
    }

    return {
        start: start,
        stop: stop,
        isActive: isActive,
        on: eventEmitter.on.bind(eventEmitter),
        events: events,
        update: update
    };
};
