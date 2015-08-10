var playPhase = module.exports = {};

playPhase.type = "playPhase";

playPhase.PlayPhase = function PlayPhase(wormHandler, playerHandler, playerUtils, aiHandler) {
    var type = playPhase.type;
    var run;

    playerHandler.on(playerHandler.events.PLAYER_DIED, function onPlayerDied(players, player) {
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

        aiHandler.update();

        playerUtils.forEachAliveWorm(players, function (player, worm) {
            wormHandler.update(deltaTime, players, map, player, worm);
        });
    }

    function isRunning() {
        return run;
    }

    function end() {
    }

    return {
        type: type,
        start: start,
        update: update,
        isRunning: isRunning,
        end: end
    }
};


