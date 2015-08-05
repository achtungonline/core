var Player = require("./player.js").Player;
var Worm = require("./worm/Worm.js");
var ShapeFactory = require("./../geometry/shape-factory.js");

module.exports = function PlayerFactory(idGenerator, wormFactory) {

    var shapeFactory = ShapeFactory();

    function create() {
        return Player(idGenerator(), wormFactory.create());
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
    }
}