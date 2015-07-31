var EventEmitter = require("events").EventEmitter;

var EVENT_PLAYER_DIED = "playerDied";
var events = [EVENT_PLAYER_DIED];

module.exports = function PlayerHandler(collisionHandler, playerModifier) {
    var eventEmitter = new EventEmitter();

    collisionHandler.on("wormMapCollision", function onWormMapCollision(players, player, worm) {
        var index = player.worms.indexOf(worm);
        player.worms.splice(index, 1);

        if (player.worms.length === 0) {
            eventEmitter.emit(EVENT_PLAYER_DIED, players, player);
        }
    });

    return {
        on: eventEmitter.on.bind(eventEmitter)
    };
};