var EventEmitter = require("events").EventEmitter;

module.exports = function Game(nextFrameProvider, shapeHandler, map, players) {
    var eventEmitter = new EventEmitter();
    var previousTime;

    function start() {
        previousTime = Date.now();
        update();
    }

    function update() {
        var currentTime = Date.now();
        var deltaTime = (currentTime - previousTime) / 1000; //Delta time is in seconds.

        players.forEach(function (player) {
            player.worms.forEach(function (worm) {
                var xDiff = Math.cos(worm.direction) * worm.speed * deltaTime;
                var yDiff = Math.sin(worm.direction) * worm.speed * deltaTime;
                shapeHandler.move(worm.head, xDiff, yDiff);
            });
        });

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
