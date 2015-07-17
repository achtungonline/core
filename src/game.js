var EventEmitter = require("events").EventEmitter;

module.exports = function Game(frameProvider, map, players) {
    var eventEmitter = new EventEmitter();

    function start() {
        update();
    }

    function update() {
        eventEmitter.emit("updated");

        frameProvider(function onNextFrame() {
            update();
        }); 
    }

	return {
		map: map,
        players: players,
        start: start,
        on: eventEmitter.on.bind(eventEmitter)
	};
};
