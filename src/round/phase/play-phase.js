var playPhase = module.exports = {};

playPhase.type = "playPhase";

playPhase.PlayPhase = function PlayPhase(eventHandler, wormModifier, collisionHandler) {
    var type = playPhase.type;
    var run;

    eventHandler.on(eventHandler.events.PLAYER_DIED, function onPlayerDied(players, player) {
        var numAlivePlayers = 0;

        players.forEach(function (player) {
            if (player.worms.length > 0) {
                numAlivePlayers++;
            }
        });

        if (numAlivePlayers === 1) {
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
        players.forEach(function (player) {
            player.worms.forEach(function (worm) {
                wormModifier.updateDirection(deltaTime, player, worm);
                wormModifier.updatePosition(deltaTime, worm);
                wormModifier.createAndPushNextBodyPart(worm);
            });
        });

        players.forEach(function (player) {
            player.worms.forEach(function (worm) {
                collisionHandler.wormMapCollisionDetection(players, player, worm, map)
            });
        });

        players.forEach(function (player) {
            player.worms.forEach(function (worm) {
                players.forEach(function (otherPlayer) {
                    otherPlayer.worms.forEach(function (otherWorm) {
                        collisionHandler.wormWormCollisionDetection(players, player, worm, otherWorm);
                    });
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
}


