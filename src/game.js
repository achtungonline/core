var EventEmitter = require("events").EventEmitter;

module.exports = function Game(nextFrameProvider, map, players) {
    var eventEmitter = new EventEmitter();
    var previousTime;

    function start() {
        previousTime = Date.now();
        update();
    }

    function update() {
        var currentTime = Date.now();
        var deltaTime = currentTime - previousTime;

        eventEmitter.emit("updated");

        nextFrameProvider(function onNextFrame() {
            update();
        });

        previousTime = currentTime;
    }

	return {
		map: map,
        players: players,
        start: start,
        on: eventEmitter.on.bind(eventEmitter)
	};
};
