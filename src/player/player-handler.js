module.exports = function PlayerHandler(eventHandler) {
    eventHandler.register(eventHandler.events.PLAYER_DIED);

    eventHandler.on(eventHandler.events.WORM_MAP_COLLISION, function onWormMapCollision(players, player, worm) {
        wormCrashed(players, player, worm);
    });

    eventHandler.on(eventHandler.events.WORM_WORM_COLLISION, function onWormWormCollision(players, player, worm) {
        wormCrashed(players, player, worm);
    });

    function wormCrashed(players, player, worm) {
        var index = player.worms.indexOf(worm);
        player.worms.splice(index, 1);

        if (player.worms.length === 0) {
            eventHandler.emit(eventHandler.events.PLAYER_DIED, players, player);
        }
    }

    function setSteering(player, steering) {
        player.steering = steering;
    }

    return {
        setSteering: setSteering
    }
};