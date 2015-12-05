var Player = require("./player.js").Player;

module.exports = function PlayerFactory(idGenerator) { //TODO think about a better solution with idGenerator

    function create(id) {
        return Player(id !== undefined ? id : idGenerator(), true);
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