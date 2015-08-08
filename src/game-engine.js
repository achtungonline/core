module.exports = function GameEngine(requestUpdateTick, eventHandler, roundHandler) {
    var previousTime;
    var run;
    var paused;

    function start(players, map) {
        run = true;
        previousTime = getCurrentTime();
        roundHandler.start(players, map);
        update(players, map);
    }

    function switchPaused() {
        paused = !paused;
    }

    function stopUpdating() {
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
            stopUpdating();
        }

        eventHandler.emit(eventHandler.events.GAME_UPDATED);

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
        stop: stopUpdating,
        switchPaused: switchPaused,
        isRunning: isRunning
    }
}