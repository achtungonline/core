var RoundHandlerFactory = require("./round/round-handler-factory.js");
var MapFactory = require("./map/map-factory.js");
var GameEngine = require("./game-engine.js");
var WormHandlerFactory = require("./player/worm/worm-handler-factory.js");
var PlayerHandler = require("./player/player-handler.js");
var Game = require("./game.js");
var AIHandlerFactory = require("./player/ai/ai-handler-factory.js");
var GameState = require("./game-state.js");
var PlayArea = require("./play-area/play-area.js");
var PlayAreaHandler = require("./play-area/play-area-handler.js");

module.exports = function GameFactory(requestUpdateTick) {
    var mapFactory = MapFactory();

    function create(playerSetup, map, random) {

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

        var gameState = GameState(players, worms, map, playArea, []);

        map.blockingShapes.forEach(function (blockingShape) {
            playAreaHandler.applyObstacleShape(gameState, blockingShape);
        });

        var wormHandlerFactory = WormHandlerFactory(playAreaHandler, random);
        var wormHandler = wormHandlerFactory.create();

        var playerHandler = PlayerHandler(wormHandler);
        var roundHandlerFactory = RoundHandlerFactory(wormHandler, playerHandler, random);

        var roundHandler = roundHandlerFactory.create();

        var gameEngine = GameEngine(requestUpdateTick, roundHandler, playAreaHandler);

        var game = Game(gameState, gameEngine, playerHandler);

        var aiHandler = AIHandlerFactory(game, playAreaHandler, random).create();
        playerSetup.AIPlayers.forEach(function (aiPlayer) {
            aiHandler.addAIPlayer(aiPlayer);
        });

        return game;
    }

    return {
        create: create
    };
};