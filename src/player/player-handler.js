var EventEmitter = require("events").EventEmitter;

var EVENT_PLAYER_DIED = "playerDied";
var events = [EVENT_PLAYER_DIED];

module.exports = function PlayerHandler(wormHandler) {
    var eventEmitter = new EventEmitter();

    wormHandler.on("collisionMap", function onCollisionMap(players, player, worm) {
        var index = player.worms.indexOf(worm);
        player.worms.splice(index, 1);

        if (player.worms.length === 0) {
            eventEmitter.emit(EVENT_PLAYER_DIED, players, player);
        }
    });

    function updateDirection(deltaTime, player) {
        player.worms.forEach(function (worm) {
            worm.direction += player.steering * deltaTime;
        });
    }

    function updatePlayer(deltaTime, players, map, player) {
        updateDirection(deltaTime, player);

        player.worms.forEach(function (worm) {
            wormHandler.moveWorm(deltaTime, worm);
            wormHandler.performCollisionDetection(players, map, worm);
        });
    }

    function setSteering(player, steering) {
        player.steering = steering;
    }

    return {
        updatePlayer: updatePlayer,
        setSteering: setSteering,
        on: eventEmitter.on.bind(eventEmitter)
    };
};