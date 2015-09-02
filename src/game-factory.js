var RoundHandlerFactory = require("./round/round-handler-factory.js");
var MapFactory = require("./map/map-factory.js");
var GameEngine = require("./game-engine.js");
var WormHandlerFactory = require("./player/worm/worm-handler-factory.js");
var GridFactory = require("./grid/grid-factory.js").GridFactoryCoveringArea;
var PlayerHandler = require("./player/player-handler.js");
var Game = require("./game.js");
var AIHandler = require("./player/ai/ai-handler.js");
var GameState = require("./game-state.js");
var PlayArea = require("./play-area/play-area.js");
var PlayAreaHandler = require("./play-area/play-area-handler.js");

module.exports = function GameFactory(requestUpdateTick) {
    var mapFactory = MapFactory();

    function create(playerSetup, map) {

        var players = playerSetup.humanPlayers.concat(playerSetup.AIPlayers);
        if (!map) {
            map = mapFactory.createSquare(800);
        }

        var worms = [];
        players.forEach(function (player) {
            player.worms.forEach(function (worm) {
                worms.push(worm);
            });
        });

        var playArea = PlayArea.createPlayArea(map.width, map.height);
        var playAreaHandler = PlayAreaHandler();

        var gameState = GameState(players, worms, map, playArea);

        var wormHandlerFactory = WormHandlerFactory(playAreaHandler);
        var wormHandler = wormHandlerFactory.create();

        var playerHandler = PlayerHandler(wormHandler);
        var roundHandlerFactory = RoundHandlerFactory(wormHandler, playerHandler);

        var roundHandler = roundHandlerFactory.create();

        var gameEngine = GameEngine(requestUpdateTick, roundHandler, playAreaHandler);

        var game = Game(gameState, gameEngine, playerHandler, playAreaHandler);

        var aiHandler = AIHandler(game);
        playerSetup.AIPlayers.forEach(function (aiPlayer) {
            aiHandler.addAIPlayer(aiPlayer);
        });

        return game;
    }

    return {
        create: create
    };
};