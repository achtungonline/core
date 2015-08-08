var RoundHandlerFactory = require("./round/round-handler-factory.js");
var ShapeModifierIFactory = require("./geometry/shape-modifier-immutable-factory.js");
var MapFactory = require("./map/map-factory.js");
var GameEngine = require("./game-engine.js");
var WormHandler = require("./player/worm/worm-handler.js");
var WormBodyHandler = require("./player/worm/worm-body-handler.js");
var WormGridFactory = require("./grid-factory.js").GridFactoryCoveringArea;
var WormBodyGridHandler = require("./player/worm/worm-body-grid-handler.js");
var WormBodyImmunityHandler = require("./player/worm/worm-body-immunity-handler.js");
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


        var wormBodyGridHandler = WormBodyGridHandler(WormGridFactory(map.width, map.height, 30));
        var wormBodyImmunityHandler = WormBodyImmunityHandler(shapeSpatialRelations);
        var wormBodyHandler = WormBodyHandler(wormBodyGridHandler, wormBodyImmunityHandler);
        var wormHandler = WormHandler(shapeModifierI, wormBodyHandler, wormBodyImmunityHandler, clone);
        var wormWormCollisionHandler = WormWormCollisionHandler(eventHandler, wormBodyGridHandler, wormBodyImmunityHandler, shapeSpatialRelations);
        var collisionHandler = CollisionHandler(eventHandler, wormWormCollisionHandler, mapUtils);
        var playerHandler = PlayerHandler(eventHandler);

        var roundHandler = RoundHandlerFactory(eventHandler, wormHandler, collisionHandler).create();
        var gameEngine = GameEngine(requestUpdateTick, eventHandler, roundHandler);

        return Game(gameEngine, eventHandler, playerHandler, map, players);
    }

    return {
        create: create
    };
};