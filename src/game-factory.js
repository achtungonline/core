var nextFrameProvider = require("./next-frame-provider");
var MapFactory = require("./map-factory.js");
var ShapeFactory = require("./geometry/shape-factory.js");
var Game = require("./game.js");
var Player = require("./player.js");
var Worm = require("./worm.js");

module.exports = function GameFactory() {
    var mapFactory = MapFactory();
    var shapeFactory = ShapeFactory();

    return {
        create: function() {
            var wormRadius = 10;

            var map = mapFactory.createSquare(800);
            var players = [
                Player("id1", Worm(shapeFactory.createCircle(wormRadius, 100, 100))),
                Player("id2", Worm(shapeFactory.createCircle(wormRadius, 400, 400)))
            ];

            return Game(nextFrameProvider, map, players);
        }
    };
};