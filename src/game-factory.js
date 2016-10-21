import Game from "./core/game.js";
import AIHandler from "./ai/ai-handler.js";
import * as gsf from "./core/game-state-functions.js";
import * as random from "./core/util/random.js";
import * as coreFunctions from "./core/core-functions.js";
import * as constants from "./core/constants.js";
import * as shapeSpatialRelations from "./core/geometry/shape-spatial-relations.js";

export default function GameFactory() {
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

        gsf.enterStartPhase(gameState);

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
