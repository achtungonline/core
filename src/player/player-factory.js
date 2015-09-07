var Player = require("./player.js").Player;

module.exports = function PlayerFactory(idGenerator, wormFactory) {

    function create() {
        return Player(idGenerator(), wormFactory.create(), true);
    }

    function createPlayers(numberOfPlayers) {
        var players = [];
        for (var i = 0; i < numberOfPlayers; i++) {
            players.push(create());
        }
        return players;
    }

    return {
        create: create,
        createPlayers: createPlayers
    };
};