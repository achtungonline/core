var constants = require("./core/constants.js");
var PhaseHandler = require("./core/phase/phase-handler.js");
var GameEngine = require("./core/game-engine.js");
var WormHandler = require("./core/worm/worm-handler.js");
var PlayerHandler = require("./core/player/player-handler.js");
var Game = require("./core/game.js");
var AIHandler = require("./ai/ai-handler.js");
var PlayAreaHandler = require("./core/play-area/play-area-handler.js");
var WormBodyImmunityHandler = require("./core/worm/worm-body-immunity-handler.js");
var CollisionHandler = require("./core/collision/collision-handler.js");
var PowerUpHandler = require("./core/power-up/power-up-handler.js");
var EffectHandler = require("./core/power-up/effect-handler.js");
var idGenerator = require("./core/util/id-generator.js");
var gameStateFunctions = require("./core/game-state-functions.js");

module.exports = function GameFactory() {
    function create({map, seed, players}) {
        var gameState = gameStateFunctions.createGameState(map, seed);

        players.forEach(function (player) {
            gameStateFunctions.addPlayer(gameState, player.id);
        });

        var playAreaHandler = PlayAreaHandler();

        map.blockingShapes.forEach(function (blockingShape) {
            playAreaHandler.applyObstacleShape(gameState, blockingShape);
        });

        var wormBodyImmunityHandler = WormBodyImmunityHandler();
        var collisionHandler = CollisionHandler({wormBodyImmunityHandler});

        var effectHandler = EffectHandler();

        var wormHandler = WormHandler({
            collisionHandler,
            wormBodyImmunityHandler,
            playAreaHandler
        });

        var playerHandler = PlayerHandler(wormHandler);

        var powerUpHandler = PowerUpHandler({
            wormHandler,
            effectHandler,
            collisionHandler
        });

        var wormIdGenerator = idGenerator.indexCounterId(0);

        var phaseHandler = PhaseHandler({
            wormIdGenerator,
            wormHandler,
            playerHandler,
            powerUpHandler,
            effectHandler
        });

        var gameEngine = GameEngine(phaseHandler, playAreaHandler);

        var game = Game(gameState, gameEngine, playerHandler);

        var aiHandler = AIHandler({game});

        players.filter(function (player) {
            return player.type === 'bot';
        }).map(function (player) {
            return gameStateFunctions.getPlayer(gameState, player.id);
        }).forEach(function (aiPlayer) {
            aiHandler.addAIPlayer(aiPlayer);
        });

        return game;
    }

    return {
        create: create
    };
};
