var EventEmitter = require("events").EventEmitter;


module.exports = function GameEngine(requestUpdateTick, roundHandler, playAreaHandler) {
    var eventEmitter = new EventEmitter();
    var events = {};
    events.GAME_UPDATED = "gameUpdated";
    events.GAME_OVER = "gameOver";

    var previousTime;
    var run;
    var paused;

    roundHandler.on(roundHandler.events.NEW_PHASE_STARTED, function (phaseType) {
        console.log("Phase: " + phaseType + " started");
    });

    function start(gameState) {
        run = true;
        previousTime = getCurrentTime();
        roundHandler.start(gameState);
        update(gameState);
    }

    function switchPaused() {
        paused = !paused;
    }

    function stopGame() {
        eventEmitter.emit(events.GAME_OVER);
        run = false;
    }

    function getCurrentTime() {
        return Date.now();
    }

    function update(gameState) {
        function updatePrevTimeAndGetDeltaTime() {
            var DELTA_TIME_DIVIDER = 1000;

            var currentTime = getCurrentTime();
            deltaTime = (currentTime - previousTime) / DELTA_TIME_DIVIDER; //Delta time is in seconds.

            previousTime = currentTime;

            return deltaTime;
        }

        var deltaTime = updatePrevTimeAndGetDeltaTime();

        if (!isRunning() || isPaused() || deltaTime === 0) {
            return;
        }

        roundHandler.update(gameState, deltaTime);

        if (!roundHandler.isRunning()) {
            stopGame();
        }

        eventEmitter.emit(events.GAME_UPDATED);
        playAreaHandler.resetUpdateBuffer();

        requestUpdateTick(function onUpdateTick() {
            update(gameState);
        });
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
    }
};