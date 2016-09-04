var constants = require("./constants");
var gameStateFunctions = require("./game-state-functions.js");
var coreFunctions = require("./core-functions.js");
var shapeSpatialRelations = require("./geometry/shape-spatial-relations.js");
var shapeModifierI = require("./geometry/shape-modifier-immutable.js");
var jumpHandler = require("./worm/jump-handler.js")();
var random = require("./util/random.js");

module.exports = function Game(gameState, playerHandler, powerUpHandler, effectHandler, aiHandler) {
    function start() {
        function createWorms(gameState) {
            gameStateFunctions.forEachAlivePlayer(gameState, function (player) {
                gameStateFunctions.addWorm(gameState, {playerId: player.id});
            });
        }

        function setWormStartingPositions(gameState, worms, map) {
            function isTooCloseToOtherWorms(worms, shape) {
                var biggerShape = shapeModifierI.changeSize(shape, 70, 70);
                for (var i in worms) {
                    var worm = worms[i];
                    if (shapeSpatialRelations.intersects(worm.head, biggerShape)) {
                        return true;
                    }
                }
                return false;
            }

            function getWormHeadInsidePlayableMapArea(worm) {
                return coreFunctions.getShapeRandomlyInsidePlayableArea(gameState, map, worm.head, 50);
            }

            var updatedWorms = [];
            gameStateFunctions.forEachAliveWorm(gameState, function (worm) {
                var newHead = getWormHeadInsidePlayableMapArea(worm);
                var counter = 0;
                while (isTooCloseToOtherWorms(updatedWorms, newHead)) {
                    if (counter > 100000) {
                        throw Error("Failed to find starting position for worm that does not collide with other worms.");
                    }
                    newHead = getWormHeadInsidePlayableMapArea(worm);
                    counter++;
                }
                worm.head = newHead;
                updatedWorms.push(worm);
            });

        }

        function setWormStartingDirections(gameState, worms) {
            worms.forEach(function (worm) {
                worm.direction = random.random(gameState) * Math.PI * 2;
            });
        }
        gameState.gameActive = true;
        createWorms(gameState);  //TODO: Might want to do this and setWormStartingPos together
        setWormStartingPositions(gameState, gameState.worms, gameState.map);
        setWormStartingDirections(gameState, gameState.worms);
    }

    function stop() {
        gameState.gameActive = false;
    }

    function update(deltaTime) {
        if (!isActive(gameState) || deltaTime <= 0) {
            return;
        }
        gameState.gameTime += deltaTime;
        aiHandler.update(gameState, deltaTime);

        if(gameState.startPhaseTimer > 0) {
            playerHandler.update(gameState, deltaTime);
            coreFunctions.updateWorms(gameState, deltaTime);
            gameState.startPhaseTimer -= deltaTime;
        } else {
            powerUpHandler.update(deltaTime, gameState);
            effectHandler.update(deltaTime, gameState);
            playerHandler.update(gameState, deltaTime);
            jumpHandler.update(gameState, deltaTime);
            coreFunctions.updateWorms(gameState, deltaTime);
        }

        if (gameStateFunctions.getAlivePlayers(gameState).length <= 1) {
            stop(gameState);
        }
    }

    function isActive() {
        return gameState.gameActive;
    }

    return {
        gameState,
        start,
        stop,
        isActive,
        update
    };
};
