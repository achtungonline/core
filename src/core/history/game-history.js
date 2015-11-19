module.exports = function GameHistory(map, numberOfPlayers, seed) {

    return {
        map: map,
        numberOfPlayers: numberOfPlayers,
        seed: seed,
        updates: []
    };
};