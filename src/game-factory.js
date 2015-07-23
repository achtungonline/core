var ShapeHandler = require("./geometry/shape-handler.js");
var MapFactory = require("./map-factory.js");
var ShapeFactory = require("./geometry/shape-factory.js");
var UpdateManager = require("./update-manager.js");
var PlayerHandler = require("./player/player-handler.js");
var WormHandler = require("./player/worm-handler.js");
var Game = require("./game.js");
var Player = require("./player/player.js").Player;
var Worm = require("./player/worm.js");
var clone = require("./util/clone.js");

module.exports = function GameFactory(requestUpdateTick) {
    var mapFactory = MapFactory();
    var shapeFactory = ShapeFactory();
    var shapeHandler = ShapeHandler();

    function create(players) {
        var map = mapFactory.createSquare(800);

        var wormHandler = WormHandler(shapeHandler, clone);
        var playerHandler = PlayerHandler(wormHandler);
        var updateManager = UpdateManager(requestUpdateTick, playerHandler);

        return Game(updateManager, map, players);
    }

    return {
        create: create
    };
};