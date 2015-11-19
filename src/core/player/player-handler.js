var EventEmitter = require("events").EventEmitter;
var any = require("../util/any.js");
var playerUtils = require("./player-utils.js");

module.exports = function PlayerHandler(wormHandler) {
    var eventEmitter = new EventEmitter();
    var events = {};
    events.PLAYER_DIED = "playerDied";

    wormHandler.on(wormHandler.events.WORM_DIED, function (gameState, worm) {
        var player = playerUtils.getPlayerById(gameState.players, worm.playerId);

        function isAnyWormAlive() {
            return playerUtils.getAliveWorms(gameState.worms, worm.playerId).length > 0;
        }

        function kill() {
            if (!player.alive) {
                throw Error("Trying to kill player that is already dead");
            }
            player.alive = false;
            eventEmitter.emit(events.PLAYER_DIED, gameState, player);
        }

        if (!player.alive) {
            throw Error("A worm died for a already dead player.");
        }

        if (!isAnyWormAlive()) {
            kill();
        }
    });

    function setSteering(player, steering) {
        player.steering = steering;
    }

    return {
        setSteering: setSteering,
        on: eventEmitter.on.bind(eventEmitter),
        events: events
    };
};