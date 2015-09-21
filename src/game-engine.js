var EventEmitter = require("events").EventEmitter;

module.exports = function GameEngine(deltaTimeHandler, roundHandler, playAreaHandler) {
    var eventEmitter = new EventEmitter();
    var events = {};
    events.GAME_UPDATE_STARTING = "gameUpdateStarting";
    events.GAME_UPDATED = "gameUpdated";
    events.GAME_OVER = "gameOver";
    events.NEW_PHASE_STARTED = "newPhaseStarted";

    roundHandler.on(roundHandler.events.NEW_PHASE_STARTED, function (phaseType, gameState) {
        eventEmitter.emit(events.NEW_PHASE_STARTED, phaseType);
        if(phaseType === "roundOverPhase") {
            stop(gameState);
        }
    });


    function start(gameState) {
        gameState.gameActive = true;
        deltaTimeHandler.start(gameState);
        roundHandler.start(gameState);
        deltaTimeHandler.update(gameState, function onUpdateTick(deltaTime) {
            update(gameState, deltaTime);
        });
    }

    function pause(gameState) {
        gameState.gamePaused = true;
    }

    function resume(gameState) {
        gameState.gamePaused = false;
    }

    function stop(gameState) {
        eventEmitter.emit(events.GAME_OVER);
        gameState.gameActive = false;
    }

    function update(gameState, deltaTime) {
        if (isActive(gameState) && !isPaused(gameState) && deltaTime > 0) {
            eventEmitter.emit(events.GAME_UPDATE_STARTING, gameState, deltaTime);
            roundHandler.update(gameState, deltaTime);

            if (!roundHandler.isActive(gameState)) {
                stop();
            }

            eventEmitter.emit(events.GAME_UPDATED, gameState, deltaTime);
            playAreaHandler.resetUpdateBuffer(gameState);
        }

        if (isActive(gameState)) {
            deltaTimeHandler.update(gameState, function onUpdateTick(deltaTime) {
                update(gameState, deltaTime);
            });
        }
    }

    function isActive(gameState) {
        return gameState.gameActive;
    }

    function isPaused(gameState) {
        return gameState.gamePaused;
    }

    return {
        start: start,
        stop: stop,
        pause: pause,
        resume: resume,
        isActive: isActive,
        isPaused: isPaused,
        on: eventEmitter.on.bind(eventEmitter),
        events: events
    };
};