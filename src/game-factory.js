var ShapeHandler = require("./geometry/shape-handler.js");
var MapFactory = require("./map-factory.js");
var ShapeFactory = require("./geometry/shape-factory.js");
var Game = require("./game.js");
var Player = require("./player.js");
var Worm = require("./worm.js");

module.exports = function GameFactory() {
    var mapFactory = MapFactory();
    var shapeFactory = ShapeFactory();
    var shapeHandler = ShapeHandler();

    function create(nextUpdateHandler) {
        var wormRadius = 10;

        var map = mapFactory.createSquare(800);
        var players = [
            Player("id1", Worm(shapeFactory.createCircle(wormRadius, 100, 100), 0, 20)),
            Player("id2", Worm(shapeFactory.createCircle(wormRadius, 400, 400), 0, 20))
        ];

        return Game(nextUpdateHandler, shapeHandler, map, players);
    }

    return {
        create: function() {
            return create(function (callback){ callback() });
        },
        createLocal: function (nextUpdateHandler) {
            return create(nextUpdateHandler);
        }
    };
};