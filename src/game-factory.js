var ShapeHandler = require("./geometry/shape-handler.js");
var MapFactory = require("./map-factory.js");
var ShapeFactory = require("./geometry/shape-factory.js");
var UpdateHandler = require("./update/update-handler.js");
var Game = require("./game.js");
var Player = require("./player/player.js");
var Worm = require("./player/worm.js");

module.exports = function GameFactory(nextFrameProvider) {
    var mapFactory = MapFactory();
    var shapeFactory = ShapeFactory();
    var shapeHandler = ShapeHandler();
    var updateHandler = UpdateHandler(shapeHandler, nextFrameProvider);

    function create() {
        var wormRadius = 10;

        var map = mapFactory.createSquare(800);
        var players = [
            Player("id1", Worm(shapeFactory.createCircle(wormRadius, 100, 100), 0, 20)),
            Player("id2", Worm(shapeFactory.createCircle(wormRadius, 400, 400), 0, 20))
        ];

        return Game(updateHandler, map, players);
    }

    return {
        create: create
    };
};