var Player = require("./Player.js").Player;
var Worm = require("./Worm.js");
var ShapeFactory = require("./../geometry/shape-factory.js");

var WORM_RADIUS = 10;
var WORM_SPEED = 30;

module.exports = function PlayerFactory(idGenerator) {

    var shapeFactory = ShapeFactory();

    function create() {
        return Player(idGenerator(), Worm(idGenerator(), shapeFactory.createCircle(WORM_RADIUS, 0, 0), 0, WORM_SPEED));
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