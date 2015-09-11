var EventEmitter = require("events").EventEmitter;

module.exports = function GameEngine(deltaTimeHandler, roundHandler, playAreaHandler) {
    var eventEmitter = new EventEmitter();
    var events = {};
    events.GAME_UPDATE_STARTING = "gameUpdateStarting";
    events.GAME_UPDATED = "gameUpdated";
    events.GAME_OVER = "gameOver";

    roundHandler.on(roundHandler.events.NEW_PHASE_STARTED, function (phaseType) {
        eventEmitter.emit(roundHandler.events.NEW_PHASE_STARTED, phaseType);
    });

    function start(gameState) {
        gameState.gameActive = true;
        var deltaTimeCall = deltaTimeHandler.start();
        roundHandler.start(gameState);
        deltaTimeCall(function onUpdateTick(deltaTime) {
            update(gameState, deltaTime, deltaTimeCall);
        });
    }

    function pause(gameState) {
        gameState.gamePaused = false;
    }

    function resume(gameState) {
        gameState.gamePaused = true;
    }

    function stopGame(gameState) {
        eventEmitter.emit(events.GAME_OVER);
        gameState.gameActive = false;
    }

    function update(gameState, deltaTime, deltaTimeCall) {
        if (isActive(gameState) && !isPaused(gameState) && deltaTime > 0) {
            eventEmitter.emit(events.GAME_UPDATE_STARTING, gameState, deltaTime);
            roundHandler.update(gameState, deltaTime);

            if (!roundHandler.isActive(gameState)) {
                stopGame();
            }

            eventEmitter.emit(events.GAME_UPDATED, gameState, deltaTime);
            playAreaHandler.resetUpdateBuffer(gameState);
        }

        if (isActive(gameState)) {
            deltaTimeCall(function onUpdateTick(deltaTime) {
                update(gameState, deltaTime, deltaTimeCall);
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
        stop: stopGame,
        pause: pause,
        resume: resume,
        isActive: isActive,
        isPaused: isPaused,
        on: eventEmitter.on.bind(eventEmitter),
        events: events
    };
};