var EventEmitter = require("events").EventEmitter;


module.exports = function GameEngine(requestUpdateTick, roundHandler) {
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

    function start(players, map) {
        run = true;
        previousTime = getCurrentTime();
        roundHandler.start(players, map);
        update(players, map);
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

    function update(players, map) {
        function updatePrevTimeAndGetDeltaTime() {
            var DELTA_TIME_DIVIDER = 1000;

            var currentTime = getCurrentTime();
            deltaTime = (currentTime - previousTime) / DELTA_TIME_DIVIDER; //Delta time is in seconds.

            //Minimum delta time is 1 msec (to avoid problems of dividing .
            if (deltaTime === 0) {
                deltaTime = 1 / DELTA_TIME_DIVIDER; //1 msec.
            }

            previousTime = currentTime;

            return deltaTime;
        }

        var deltaTime = updatePrevTimeAndGetDeltaTime();

        if (!isRunning() || isPaused()) {
            return;
        }

        roundHandler.update(deltaTime, players, map);

        if (!roundHandler.isRunning()) {
            stopGame();
        }

        eventEmitter.emit(events.GAME_UPDATED);

        requestUpdateTick(function onUpdateTick() {
            update(players, map);
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