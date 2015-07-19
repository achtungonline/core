var EventEmitter = require("events").EventEmitter;

module.exports = function Game(nextUpdateHandler, shapeHandler, map, players) {
    var previousTime;
    var eventEmitter = new EventEmitter();

    function start() {
        previousTime = Date.now();

        update();
    }

    function update() {

        var currentTime = Date.now();
        var deltaTime = (currentTime - previousTime) / 1000; //Delta time is in seconds.
        previousTime = currentTime;

        players.forEach(function (player) {
            player.worms.forEach(function (worm) {
                var xDiff = Math.cos(worm.direction) * worm.speed * deltaTime;
                var yDiff = Math.sin(worm.direction) * worm.speed * deltaTime;
                shapeHandler.move(worm.head, xDiff, yDiff);
            });
        });

        finalizeUpdate();
    }

    function finalizeUpdate() {
        eventEmitter.emit("updated");
        nextUpdateHandler(function nextUpdate() {
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