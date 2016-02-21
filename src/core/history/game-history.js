module.exports = function GameHistory(map, playerConfigs, seed) {

    return {
        map: map,
        playerConfigs: playerConfigs,
        seed: seed,
        updates: []
    };
};