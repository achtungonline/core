var RoundHandlerFactory = require("./round/round-handler-factory.js");
var MapFactory = require("./map/map-factory.js");
var GameEngine = require("./game-engine.js");
var WormHandlerFactory = require("./player/worm/worm-handler-factory.js");
var WormGridFactory = require("./grid-factory.js").GridFactoryCoveringArea;
var PlayerHandler = require("./player/player-handler.js");
var Game = require("./game.js");
var AIHandler = require("./player/ai/ai-handler.js");

module.exports = function GameFactory(requestUpdateTick) {
    var mapFactory = MapFactory();

    function createGameState(players, worms, map) {
        return {players: players, worms: worms, map: map};
    }

    function create(playerSetup, map) {

        var players = playerSetup.humanPlayers.concat(playerSetup.AIPlayers);
        if (!map) {
            map = mapFactory.createSquare(800);
        }

        var worms = [];
        players.forEach(function(player) {
            player.worms.forEach(function(worm) {
                worms.push(worm);
            });
        });

        var gameState = createGameState(players, worms, map);

        var wormHandlerFactory = WormHandlerFactory(WormGridFactory(map.width, map.height, 8));
        var wormHandler = wormHandlerFactory.create();

        var playerHandler = PlayerHandler(wormHandler);
        var roundHandlerFactory = RoundHandlerFactory(wormHandler, playerHandler);

        var roundHandler = roundHandlerFactory.create();

        var gameEngine = GameEngine(requestUpdateTick, roundHandler);

        var game = Game(gameState, gameEngine, playerHandler);

        var aiHandler = AIHandler(game);
        playerSetup.AIPlayers.forEach(function(aiPlayer) {
            aiHandler.addAIPlayer(aiPlayer);
        });

        return game;
    }

    return {
        create: create
    };
};