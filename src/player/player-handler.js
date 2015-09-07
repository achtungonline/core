var EventEmitter = require("events").EventEmitter;
var any = require("../util/any.js");

module.exports = function PlayerHandler(wormHandler) {
    var eventEmitter = new EventEmitter();
    var events = {};
    events.PLAYER_DIED = "playerDied";

    wormHandler.on(wormHandler.events.WORM_DIED, function (gameState, player, worm) {
        function isAnyWormAlive(player) {
            return any(player.worms, function (worm) {
                return worm.alive;
            });
        }

        function kill(player) {
            if (!player.alive) {
                throw Error("Trying to kill player that is already dead");
            }
            player.alive = false;
            eventEmitter.emit(events.PLAYER_DIED, gameState, player);
        }

        if (!player.alive) {
            throw Error("A worm died for a already dead player.");
        }

        if (!isAnyWormAlive(player)) {
            kill(player);
        }
    });

    function setSteering(player, steering) {
        player.steering = steering;
        player.worms.forEach(function (worm) {
            worm.trajectory = [{steering: player.steering, time: 1}];
        });
    }

    return {
        setSteering: setSteering,
        on: eventEmitter.on.bind(eventEmitter),
        events: events
    };
};