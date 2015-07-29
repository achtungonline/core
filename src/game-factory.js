var ShapeModifier = require("./geometry/shape-modifier.js");
var MapFactory = require("./map/map-factory.js");
var ShapeFactory = require("./geometry/shape-factory.js");
var UpdateManager = require("./update-manager.js");
var PlayerModifier = require("./player/player-modifier.js");
var WormModifier = require("./player/worm-modifier.js");
var Game = require("./game.js");
var Player = require("./player/player.js").Player;
var Worm = require("./player/worm.js");
var clone = require("./util/clone.js");
var mapUtils = require("./map/map-utils.js");

module.exports = function GameFactory(requestUpdateTick) {
    var mapFactory = MapFactory();
    var shapeFactory = ShapeFactory();
    var shapeModifier = ShapeModifier();

    function create(players) {
        var map = mapFactory.createSquare(800);

        var wormModifier = WormModifier(mapUtils, shapeModifier, clone);
        var playerModifier = PlayerModifier(wormModifier);
        var updateManager = UpdateManager(requestUpdateTick, playerModifier);

        return Game(updateManager, map, players);
    }

    return {
        create: create
    };
};