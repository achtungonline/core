var RoundHandlerFactory = require("./round/round-handler-factory.js");
var MapFactory = require("./map/map-factory.js");
var GameEngine = require("./game-engine.js");
var WormHandlerFactory = require("./player/worm/worm-handler-factory.js");
var WormGridFactory = require("./grid-factory.js").GridFactoryCoveringArea;
var PlayerHandler = require("./player/player-handler.js");
var AIHandler = require("./player/ai/ai-handler.js");
var playerUtils = require("./player/player-utils.js");
var Game = require("./game.js");

module.exports = function GameFactory(requestUpdateTick) {
    var mapFactory = MapFactory();

    function create(players, map) {

        if (!map) {
            map = mapFactory.createSquare(800);
        }

        var wormHandlerFactory = WormHandlerFactory(WormGridFactory(map.width, map.height, 30));
        var wormHandler = wormHandlerFactory.create();

        var aiHandler = AIHandler();
        var playerHandler = PlayerHandler(wormHandler, aiHandler);

        var roundHandlerFactory = RoundHandlerFactory(wormHandler, playerHandler, aiHandler);
        var roundHandler = roundHandlerFactory.create();

        var gameEngine = GameEngine(requestUpdateTick, roundHandler);

        return Game(gameEngine, playerHandler, map, players);
    }

    return {
        create: create
    };
};