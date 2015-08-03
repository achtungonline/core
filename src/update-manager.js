var ShapeModifier = require("./geometry/shape-modifier.js");

module.exports = function UpdateManager(requestUpdateTick, eventHandler, wormHandler, collisionHandler) {
    var run;
    var previousTime;

    eventHandler.register(eventHandler.events.GAME_OVER);
    eventHandler.register(eventHandler.events.GAME_UPDATED);

    eventHandler.on(eventHandler.events.PLAYER_DIED, function onPlayerDied(players, player) {
        var numAlivePlayers = 0;

        players.forEach(function (player) {
            if (player.worms.length > 0) {
                numAlivePlayers++;
            }
        });

        if (numAlivePlayers === 1) {
            eventHandler.emit(eventHandler.events.GAME_OVER);
            stopUpdating();
        }
    });

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
            player.worms.forEach(function (worm) {
                wormHandler.updateDirection(deltaTime, player, worm);
                wormHandler.updatePosition(deltaTime, worm);
            });
        });

        players.forEach(function (player) {
            player.worms.forEach(function (worm) {
                collisionHandler.wormMapCollisionDetection(players, player, worm, map)

                players.forEach(function (otherPlayer) {
                    otherPlayer.worms.forEach(function (otherWorm) {
                        if (otherWorm.id !== worm.id) {
                            collisionHandler.wormWormCollisionDetection(players, player, worm, otherWorm);
                        }
                    });
                });

            });
        })

        eventHandler.emit(eventHandler.events.GAME_UPDATED);

        requestUpdateTick(function onUpdateTick() {
            update(players, map);
        });
    }

    return {
        start: start,
        stop: stopUpdating
    }
}