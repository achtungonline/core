var ShapeModifier = require("./geometry/shape-modifier.js");
var MapFactory = require("./map/map-factory.js");
var UpdateManager = require("./update-manager.js");
var PlayerModifier = require("./player/player-modifier.js");
var WormModifier = require("./player/worm/worm-modifier.js");
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

        var shapeModifier = ShapeModifier();
        var wormModifier = WormModifier(eventHandler, shapeModifier, clone);
        var playerModifier = PlayerModifier();


        //TODO: This logic is only here temporarely, should be moved
        players.forEach(function (player) {
            player.worms.forEach(function (worm) {
                var newWormPos = mapUtils.getRandomPositionInsidePlayableArea(clone, shapeModifier, map, worm.head);
                shapeModifier.setPosition(worm.head, newWormPos.x, newWormPos.y);
            });
        });


        var wormBodyGridHandler = WormBodyGridHandler(eventHandler, WormGridFactory(map.width, map.height, 30));
        var wormWormCollisionHandler = WormWormCollisionHandler(eventHandler, wormBodyGridHandler, shapeSpatialRelations);
        var collisionHandler = CollisionHandler(eventHandler, wormWormCollisionHandler, mapUtils);
        var playerHandler = PlayerHandler(eventHandler, playerModifier);

        var updateManager = UpdateManager(requestUpdateTick, eventHandler, wormModifier, collisionHandler);

        return Game(updateManager, playerHandler, playerModifier, eventHandler, map, players);
    }

    return {
        create: create
    };
};