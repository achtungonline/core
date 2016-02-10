var PhaseHandlerFactory = require("./core/phase/phase-handler-factory.js");
var MapFactory = require("./core/map/map-factory.js");
var GameEngine = require("./core/game-engine.js");
var WormHandlerFactory = require("./core/worm/worm-handler-factory.js");
var PlayerHandler = require("./core/player/player-handler.js");
var Game = require("./core/game.js");
var AIHandlerFactory = require("./ai/ai-handler-factory.js");
var GameState = require("./core/game-state.js");
var PlayArea = require("./core/play-area/play-area.js");
var PlayAreaHandlerFactory = require("./core/play-area/play-area-handler-factory.js");
var WormBodyImmunityHandler = require("./core/worm/worm-body-immunity-handler.js");
var CollisionHandlerFactory = require("./core/collision/collision-handler-factory.js");
var PowerUpHandlerFactory = require("./core/power-up/power-up-handler-factory.js");
var EffectHandlerFactory = require("./core/power-up/effect-handler-factory.js");
var WormFactory = require("./core/worm/worm-factory.js");
var idGenerator = require("./core/util/id-generator.js");
var Random = require("./core/util/random.js");
var PlayerFactory = require("./core/player/player-factory.js");
var playerUtils = require("./core/player/player-utils");

module.exports = function GameFactory() {
    var mapFactory = MapFactory();
    var playAreaHandlerFactory = PlayAreaHandlerFactory();
    var playerFactory = PlayerFactory();

    function create(options) {
        var map = options.map;
        var playerConfigs = options.playerConfigs;
        var random = options.random;

        var players = playerConfigs.map(function (playerConfig) {
            return playerFactory.create(playerConfig.id);
        });
        if (!map) {
            map = mapFactory.createSquare(800);
        }

        var playArea = PlayArea.createPlayArea(map.width, map.height);
        var playAreaHandler = playAreaHandlerFactory.create();

        var worms = []; // The worms get created in startPhase
        var gameState = GameState(players, worms, map, playArea, []);

        map.blockingShapes.forEach(function (blockingShape) {
            playAreaHandler.applyObstacleShape(gameState, blockingShape);
        });

        var wormBodyImmunityHandler = WormBodyImmunityHandler();
        var collisionHandler = CollisionHandlerFactory(playAreaHandler, wormBodyImmunityHandler).create();

        var effectHandlerFactory = EffectHandlerFactory({
            random: random
        });
        var effectHandler = effectHandlerFactory.create();


        var wormHandlerFactory = WormHandlerFactory(collisionHandler, wormBodyImmunityHandler, playAreaHandler, random, effectHandler);
        var wormHandler = wormHandlerFactory.create();

        var playerHandler = PlayerHandler(wormHandler);

        var powerUpHandlerFactory = PowerUpHandlerFactory({
            wormHandler: wormHandler,
            effectHandler: effectHandler,
            collisionHandler: collisionHandler,
            random: random
        });
        var powerUpHandler = powerUpHandlerFactory.create();

        var wormFactory = WormFactory(idGenerator.indexCounterId(0));

        var roundHandlerFactory = PhaseHandlerFactory({
            wormFactory: wormFactory,
            wormHandler: wormHandler,
            playerHandler: playerHandler,
            powerUpHandler: powerUpHandler,
            effectHandler: effectHandler,
            random: random
        });

        var roundHandler = roundHandlerFactory.create();

        var gameEngine = GameEngine(roundHandler, playAreaHandler);

        var game = Game(gameState, gameEngine, playerHandler);

        var aiRandom = Random(random.getSeed()); // Give AI their own random so that they don't interfere with stuff. Replay does not play AI...
        var aiHandler = AIHandlerFactory(game, playAreaHandler, aiRandom).create();

        playerConfigs.filter(function (playerConfig) {
            return playerConfig.type === 'bot';
        }).map(function (playerConfig) {
            return playerUtils.getPlayerById(players, playerConfig.id);
        }).forEach(function (aiPlayer) {
            aiHandler.addAIPlayer(aiPlayer);
        });

        return game;
    }

    return {
        create: create
    };
};
