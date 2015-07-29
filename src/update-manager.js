var EventEmitter = require("events").EventEmitter;
var ShapeModifier = require("./geometry/shape-modifier.js");

var EVENT_UPDATED = "updated";
var EVENT_GAME_OVER = "gameOver";
var events = [EVENT_UPDATED, EVENT_GAME_OVER];

module.exports = function UpdateManager(requestUpdateTick, playerModifier) {
    var run;
    var eventEmitter = new EventEmitter();
    var previousTime;

    playerModifier.on("playerDied", function onPlayerDied(players, player) {
        var numAlivePlayers = 0;

        players.forEach(function (player) {
            if (player.worms.length > 0) {
                numAlivePlayers++;
            }
        });

        if (numAlivePlayers === 1) {
            eventEmitter.emit(EVENT_GAME_OVER);
            stopUpdating();
        }
    });

    function setPlayerSteering(player, steering) {
        playerModifier.setSteering(player, steering);
    }

    function start(players, map) {
        run = true;
        previousTime = getCurrentTime();
        update(players, map);
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

        if (!run) {
            return;
        }

        var deltaTime = updatePrevTimeAndGetDeltaTime();

        players.forEach(function (player) {
            playerModifier.updatePlayer(deltaTime, players, map, player);
        });

        eventEmitter.emit(EVENT_UPDATED);

        requestUpdateTick(function onUpdateTick() {
            update(players, map);
        });
    }

    return {
        events: events,
        start: start,
        stop: stopUpdating,
        on: eventEmitter.on.bind(eventEmitter),
        setPlayerSteering: setPlayerSteering
    }
}