var utils = module.exports = {};

utils.forEachAlivePlayer = function forEachAlivePlayer(players, callback) {
    players.forEach(function (player) {
        if (player.alive) {
            callback(player);
        }
    });
};

utils.forEachAliveWorm = function forEachAliveWorm(players, callback) {
    utils.forEachAlivePlayer(players, function (player) {
        utils.forEachAlivePlayerWorm(player, function (worm) {
            callback(player, worm);
        });
    });
};

utils.forEachAlivePlayerWorm = function forEachAlivePlayerWorm(player, callback) {
    if (player.alive) {
        player.worms.forEach(function (worm) {
            if (worm.alive) {
                callback(worm);
            }
        });
    }
};

utils.getAlivePlayers = function getAlivePlayers(players) {
    var alivePlayers = [];
    utils.forEachAlivePlayer(players, function (player) {
        alivePlayers.push(player);
    });
    return alivePlayers;
};