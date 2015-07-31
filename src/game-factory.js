var ShapeModifier = require("./geometry/shape-modifier.js");
var MapFactory = require("./map/map-factory.js");
var UpdateManager = require("./update-manager.js");
var PlayerModifier = require("./player/player-modifier.js");
var WormModifier = require("./player/worm/worm-modifier.js");
var PlayerHandler = require("./player/player-handler.js");
var CollisionHandler = require("./collision-handler.js");
var EventHandler = require("./event-handler.js");
var Game = require("./game.js");
var clone = require("./util/clone.js");
var mapUtils = require("./map/map-utils.js");

module.exports = function GameFactory(requestUpdateTick) {
    var mapFactory = MapFactory();
    var shapeModifier = ShapeModifier();

    function create(players, map) {
        if (!map) {
            map = mapFactory.createSquare(800);
        }

        var wormModifier = WormModifier(shapeModifier, clone);
        var playerModifier = PlayerModifier();

        var eventHandler = EventHandler();
        var collisionHandler = CollisionHandler(eventHandler, mapUtils);
        var playerHandler = PlayerHandler(eventHandler, playerModifier);

        var updateManager = UpdateManager(requestUpdateTick, eventHandler, wormModifier, collisionHandler);

        return Game(updateManager, playerHandler, playerModifier, eventHandler, map, players);
    }

    return {
        create: create
    };
};