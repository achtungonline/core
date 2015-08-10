var RoundHandlerFactory = require("./round/round-handler-factory.js");
var MapFactory = require("./map/map-factory.js");
var GameEngine = require("./game-engine.js");
var WormHandlerFactory = require("./player/worm/worm-handler-factory.js");
var WormGridFactory = require("./grid-factory.js").GridFactoryCoveringArea;
var PlayerHandler = require("./player/player-handler.js");
var AIHandler = require("./player/ai/ai-handler.js");
var CollisionHandlerFactory = require("./collision/collision-handler-factory.js");
var EventHandler = require("./event-handler.js");
var Game = require("./game.js");

module.exports = function GameFactory(requestUpdateTick) {
    var mapFactory = MapFactory();

    function create(players, map) {

        if (!map) {
            map = mapFactory.createSquare(800);
        }
        var eventHandler = EventHandler();

        var wormHandlerFactory = WormHandlerFactory(WormGridFactory(map.width, map.height, 30), eventHandler);
        var wormHandler = wormHandlerFactory.create();

        var collisionHandlerFactory = CollisionHandlerFactory(eventHandler, wormHandler);
        var collisionHandler = collisionHandlerFactory.create();

        var aiHandler = AIHandler();
        var playerHandler = PlayerHandler(eventHandler, aiHandler);

        var roundHandlerFactory = RoundHandlerFactory(eventHandler, wormHandler, collisionHandler, aiHandler);
        var roundHandler = roundHandlerFactory.create();

        var gameEngine = GameEngine(requestUpdateTick, eventHandler, roundHandler);

        return Game(gameEngine, eventHandler, playerHandler, map, players);
    }

    return {
        create: create
    };
};