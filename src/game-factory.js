var Game = require("./core/game.js");
var AIHandler = require("./ai/ai-handler.js");
var gsf = require("./core/game-state-functions.js");
var random = require("./core/util/random.js");
var coreFunctions = require("./core/core-functions.js");
var constants = require("./core/constants.js");
var shapeSpatialRelations = require("./core/geometry/shape-spatial-relations.js");

module.exports = function GameFactory() {
    function create({map, seed, players}) {
        var gameState = gsf.createGameState({map, seed});

        function isTooCloseToOtherWorms(position) {
            for (var i in gameState.worms) {
                var worm = gameState.worms[i];
                if (shapeSpatialRelations.intersects(worm, {centerX: position.x, centerY: position.y, radius: constants.WORM_RADIUS + constants.START_DISTANCE_TO_WORMS})) {
                    return true;
                }
            }
            return false;
        }

        map.blockingShapes.forEach(blockingShape => gsf.addPlayAreaObstacle(gameState, blockingShape));

        players.forEach(function (player) {
            gsf.addPlayer(gameState, {id: player.id});
            var position = coreFunctions.getRandomPositionInsidePlayableArea(gameState, constants.START_DISTANCE_TO_MAP + constants.WORM_RADIUS);
            var counter = 0;
            while (isTooCloseToOtherWorms(position)) {
                if (counter > 100000) {
                    throw Error("Failed to find starting position for worm that does not collide with other worms.");
                }
                position = coreFunctions.getRandomPositionInsidePlayableArea(gameState, constants.START_DISTANCE_TO_MAP + constants.WORM_RADIUS);
                counter++;
            }

            gsf.addWorm(gameState, gsf.createWorm(gameState, {
                playerId: player.id,
                direction: random.random(gameState) * Math.PI * 2,
                centerX: position.x,
                centerY: position.y,
                radius: constants.WORM_RADIUS
            }));
        });

        var aiHandler = AIHandler();
        players.filter(player => player.type === "bot")
            .map(player => gsf.getPlayer(gameState, player.id))
            .forEach(aiPlayer => aiHandler.addAIPlayer(aiPlayer));

        return Game(gameState, aiHandler);
    }

    return {
        create: create
    };
};
