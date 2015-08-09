var playPhase = module.exports = {};

playPhase.type = "playPhase";

playPhase.PlayPhase = function PlayPhase(eventHandler, wormHandler, collisionHandler, playerUtils) {
    var type = playPhase.type;
    var run;

    eventHandler.on(eventHandler.events.PLAYER_DIED, function onPlayerDied(players, player) {
        var alivePlayers = playerUtils.getAlivePlayers(players);

        if (alivePlayers.length <= 1) {
            run = false;

        }
    });

    function start() {
        run = true;
    }

    function update(deltaTime, players, map) {
        if (!isRunning()) {
            return;
        }

        playerUtils.forEachAliveWorm(players, function (player, worm) {
            wormHandler.updateDirection(deltaTime, player, worm);
            wormHandler.updatePosition(deltaTime, worm);
            wormHandler.updateBody(deltaTime, worm);
        });

        playerUtils.forEachAliveWorm(players, function (player, worm) {
            collisionHandler.wormMapCollisionDetection(players, player, worm, map)
        });

        playerUtils.forEachAliveWorm(players, function (player, worm) {
            players.forEach(function (otherPlayer) {
                otherPlayer.worms.forEach(function (otherWorm) {
                    collisionHandler.wormWormCollisionDetection(players, player, worm, otherWorm);
                });
            });
        });
    }

    function isRunning() {
        return run;
    }

    return {
        type: type,
        start: start,
        update: update,
        isRunning: isRunning
    }
};


