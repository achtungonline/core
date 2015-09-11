var EventEmitter = require("events").EventEmitter;

module.exports = function GameEngine(deltaTimeHandler, roundHandler, playAreaHandler) {
    var eventEmitter = new EventEmitter();
    var events = {};
    events.GAME_UPDATE_STARTING = "gameUpdateStarting";
    events.GAME_UPDATED = "gameUpdated";
    events.GAME_OVER = "gameOver";

    var run;
    var paused;

    roundHandler.on(roundHandler.events.NEW_PHASE_STARTED, function (phaseType) {
        eventEmitter.emit(roundHandler.events.NEW_PHASE_STARTED, phaseType);
    });

    function start(gameState) {
        run = true;
        var deltaTimeCall = deltaTimeHandler.start();
        roundHandler.start(gameState);
        deltaTimeCall(function onUpdateTick(deltaTime) {
            update(gameState, deltaTime, deltaTimeCall);
        });
    }

    function switchPaused() {
        paused = !paused;
    }

    function stopGame() {
        eventEmitter.emit(events.GAME_OVER);
        run = false;
    }

    function update(gameState, deltaTime, deltaTimeCall) {
        if (isRunning() && !isPaused() && deltaTime > 0) {
            eventEmitter.emit(events.GAME_UPDATE_STARTING, gameState, deltaTime);
            roundHandler.update(gameState, deltaTime);

            if (!roundHandler.isRunning()) {
                stopGame();
            }

            eventEmitter.emit(events.GAME_UPDATED, gameState, deltaTime);
            playAreaHandler.resetUpdateBuffer(gameState);
        }

        if (isRunning()) {
            deltaTimeCall(function onUpdateTick(deltaTime) {
                update(gameState, deltaTime, deltaTimeCall);
            });
        }
    }

    function isRunning() {
        return run;
    }

    function isPaused() {

    }

    return {
        start: start,
        stop: stopGame,
        switchPaused: switchPaused,
        isRunning: isRunning,
        on: eventEmitter.on.bind(eventEmitter),
        events: events
    };
};