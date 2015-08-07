var RoundHandlerFactory = require("./round/round-handler-factory.js");
var ShapeModifierIFactory = require("./geometry/shape-modifier-immutable-factory.js");
var MapFactory = require("./map/map-factory.js");
var GameEngine = require("./game-engine.js");
var PlayerModifier = require("./player/player-modifier.js");
var WormModifier = require("./player/worm/worm-modifier.js");
var WormBodyModifier = require("./player/worm/worm-body-modifier.js");
var WormGridFactory = require("./grid-factory.js").GridFactoryCoveringArea;
var WormBodyGridHandler = require("./player/worm/worm-body-grid-handler.js");
var PlayerHandler = require("./player/player-handler.js");
var CollisionHandler = require("./collision-handler.js");
var WormWormCollisionHandler = require("./worm-worm-collision-handler.js");
var EventHandler = require("./event-handler.js");
var Game = require("./game.js");
var clone = require("./util/clone.js");
var mapUtils = require("./map/map-utils.js");
var shapeSpatialRelations = require("./geometry/shape-spatial-relations.js");

module.exports = function GameFactory(requestUpdateTick) {
    var mapFactory = MapFactory();

    function create(players, map) {
        if (!map) {
            map = mapFactory.createSquare(800);
        }

        var eventHandler = EventHandler();
        var shapeModifierI = ShapeModifierIFactory().create();

        var playerModifier = PlayerModifier();


        var wormBodyGridHandler = WormBodyGridHandler(WormGridFactory(map.width, map.height, 30));
        var wormBodyModifier = WormBodyModifier(wormBodyGridHandler);
        var wormModifier = WormModifier(shapeModifierI, wormBodyModifier, clone);
        var wormWormCollisionHandler = WormWormCollisionHandler(eventHandler, wormBodyGridHandler, shapeSpatialRelations);
        var collisionHandler = CollisionHandler(eventHandler, wormWormCollisionHandler, mapUtils);
        var playerHandler = PlayerHandler(eventHandler, playerModifier);

        var roundHandler = RoundHandlerFactory(eventHandler, wormModifier, collisionHandler).create();
        var gameEngine = GameEngine(requestUpdateTick, eventHandler, roundHandler);

        return Game(gameEngine, eventHandler, playerModifier, map, players);
    }

    return {
        create: create
    };
};