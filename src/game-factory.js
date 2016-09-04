var PlayerHandler = require("./core/player/player-handler.js");
var Game = require("./core/game.js");
var AIHandler = require("./ai/ai-handler.js");
var PowerUpHandler = require("./core/power-up/power-up-handler.js");
var EffectHandler = require("./core/power-up/effect-handler.js");
var gameStateFunctions = require("./core/game-state-functions.js");

module.exports = function GameFactory() {
    function create({map, seed, players}) {
        var gameState = gameStateFunctions.createGameState(map, seed);

        players.forEach(function (player) {
            gameStateFunctions.addPlayer(gameState, player.id);
        });

        map.blockingShapes.forEach(function (blockingShape) {
            gameStateFunctions.addPlayAreaObstacle(gameState, blockingShape);
        });

        var effectHandler = EffectHandler();
        var playerHandler = PlayerHandler();

        var powerUpHandler = PowerUpHandler();


        var aiHandler = AIHandler();
        players.filter(function (player) {
            return player.type === "bot";
        }).map(function (player) {
            return gameStateFunctions.getPlayer(gameState, player.id);
        }).forEach(function (aiPlayer) {
            aiHandler.addAIPlayer(aiPlayer);
        });

        return Game(gameState, playerHandler, powerUpHandler, effectHandler, aiHandler);
    }

    return {
        create: create
    };
};
