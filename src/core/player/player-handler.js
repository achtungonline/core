var EventEmitter = require("events").EventEmitter;
var any = require("../util/any.js");
var gameStateFunctions = require("./../game-state-functions.js");

module.exports = function PlayerHandler(wormHandler) {
    var eventEmitter = new EventEmitter();
    var events = {};
    events.PLAYER_DIED = "playerDied";

    wormHandler.on(wormHandler.events.WORM_DIED, function (gameState, worm) {
        var player = gameStateFunctions.getPlayer(gameState, worm.playerId);

        function isAnyWormAlive() {
            return gameStateFunctions.getAliveWorms(gameState, worm.playerId).length > 0;
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

        if (!isAnyWormAlive() && gameStateFunctions.getAlivePlayers(gameState).length > 1) {
            kill();
        }
    });

    function update(gameState, deltaTime) {
        gameState.players.forEach(function (player) {
            gameStateFunctions.addPlayerSteeringSegment(gameState, player.id, player.steering, deltaTime);
        });
    }

    return {
        update: update,
        on: eventEmitter.on.bind(eventEmitter),
        events: events
    };
};
