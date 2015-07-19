var EventEmitter = require("events").EventEmitter;
var updater = require("./updater.js");

var EVENT_UPDATED = "updated";
var events = [EVENT_UPDATED];

module.exports = function UpdateHandler(shapeHandler, updateFinishedHandler) {
    var eventEmitter = new EventEmitter();
    var previousTime;
    var deltaTime;

    function updateTimes() {
        var currentTime = getCurrentTime();
        deltaTime = (currentTime - previousTime) / 1000;    //Delta time is in seconds.
        previousTime = currentTime;
    }

    function getCurrentTime() {
        return Date.now();
    }

    function init(players) {
        previousTime = getCurrentTime();
    }

    function update(players) {
        updateTimes();

        updater.players(deltaTime, players, shapeHandler);

        finalizeUpdate(players);
    }

    function finalizeUpdate(players) {
        eventEmitter.emit(EVENT_UPDATED);
        updateFinishedHandler(function nextUpdate() {
            update(players);
        });
    }

    return {
        events: events,
        init: init,
        update: update,
        on: eventEmitter.on.bind(eventEmitter)
    }
}