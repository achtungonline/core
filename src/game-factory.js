var ShapeModifierIFactory = require("./geometry/shape-modifier-immutable-factory.js");
var MapFactory = require("./map/map-factory.js");
var UpdateManager = require("./update-manager.js");
var PlayerModifier = require("./player/player-modifier.js");
var WormModifier = require("./player/worm/worm-modifier.js");
var WormBodyModifier = require("./player/worm/worm-body-modifier.js");
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

        //TODO: This logic is only here temporarely, should be moved
        players.forEach(function (player) {
            player.worms.forEach(function (worm) {
                var newWormPos = mapUtils.getRandomPositionInsidePlayableArea(clone, shapeModifierI, map, worm.head);
                worm.head = shapeModifierI.setPosition(worm.head, newWormPos.x, newWormPos.y);
            });
        });

        var playerModifier = PlayerModifier();


        var wormBodyGridHandler = WormBodyGridHandler(WormGridFactory(map.width, map.height, 30));
        var wormBodyImmunityHandler = WormBodyImmunityHandler(shapeSpatialRelations);
        var wormBodyModifier = WormBodyModifier(wormBodyGridHandler, wormBodyImmunityHandler);
        var wormModifier = WormModifier(shapeModifierI, wormBodyModifier, wormBodyImmunityHandler, clone);
        var wormWormCollisionHandler = WormWormCollisionHandler(eventHandler, wormBodyGridHandler, wormBodyImmunityHandler, shapeSpatialRelations);
        var collisionHandler = CollisionHandler(eventHandler, wormWormCollisionHandler, mapUtils);
        var playerHandler = PlayerHandler(eventHandler, playerModifier);

        var updateManager = UpdateManager(requestUpdateTick, eventHandler, wormModifier, collisionHandler);

        return Game(updateManager, playerHandler, playerModifier, eventHandler, map, players);
    }

    return {
        create: create
    };
};