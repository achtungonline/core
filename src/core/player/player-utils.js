var utils = module.exports = {};

utils.forEachAlivePlayer = function forEachAlivePlayer(players, callback) {
    players.forEach(function (player) {
        if (player.alive) {
            callback(player);
        }
    });
};

utils.forEachAliveWorm = function forEachAliveWorm(worms, callback, playerId) {
    worms.forEach(function(worm) {
        if(worm.alive && (playerId === undefined || worm.playerId === playerId)) {
            callback(worm);
        }
    });
};

utils.getAliveWorms = function getAliveWorms(worms, playerId) {
    return worms.filter(function(worm) {
        return worm.alive && (playerId === undefined || worm.playerId === playerId);
    });
};

utils.getAlivePlayers = function getAlivePlayers(players) {
    var alivePlayers = [];
    utils.forEachAlivePlayer(players, function (player) {
        alivePlayers.push(player);
    });
    return alivePlayers;
};

utils.getPlayerById = function getPlayerById(players, playerId) {
    return players.find(function(player) {
        return player.id === playerId;
    });
};

utils.getWormById = function getWormById(worms, wormId) {
    return worms.find(function(worm) {
        return worm.id === wormId;
    });
};