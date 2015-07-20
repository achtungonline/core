var EventEmitter = require("events").EventEmitter;
var updater = require("./updater.js");

var EVENT_UPDATED = "updated";
var events = [EVENT_UPDATED];

module.exports = function UpdateHandler(shapeHandler, requestUpdateTick) {
    var eventEmitter = new EventEmitter();
    var previousTime;

    function getCurrentTime() {
        return Date.now();
    }

    function start(players) {
        previousTime = getCurrentTime();
        update(players);
    }

    function update(players) {
        function updatePrevTimeAndGetDeltaTime() {
            var DELTA_TIME_DIVIDER = 1000;

            var currentTime = getCurrentTime();
            deltaTime = (currentTime - previousTime) / DELTA_TIME_DIVIDER; //Delta time is in seconds.

            //Minimum delta time is 1 msec (to avoid problems of dividing .
            if (deltaTime === 0) {
                deltaTime = 1 / DELTA_TIME_DIVIDER; //1 msec.
            }

            console.log(currentTime - previousTime);

            previousTime = currentTime;

            return deltaTime;
        }

        var deltaTime = updatePrevTimeAndGetDeltaTime();

        updater.players(deltaTime, players, shapeHandler);

        eventEmitter.emit(EVENT_UPDATED);

        requestUpdateTick(function onUpdateTick() {
            update(players);
        });
    }

    return {
        events: events,
        start: start,
        on: eventEmitter.on.bind(eventEmitter)
    }
}