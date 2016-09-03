var shapeModifierI = require("./../geometry/shape-modifier-immutable.js");
var constants = require("../constants.js");
var random = require("./../util/random.js");
var gameStateFunctions = require("./../game-state-functions.js");
var shapeSpatialRelations = require("./../geometry/shape-spatial-relations.js");
var coreFunctions = require("../core-functions.js");

var PHASE_DURATION = 2.5; // seconds

var startPhase = module.exports = {};

startPhase.type = "startPhase";

startPhase.StartPhase = function StartPhase({playerHandler}) {
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

    function createWorms(gameState) {
        gameStateFunctions.forEachAlivePlayer(gameState, function (player) {
            gameStateFunctions.addWorm(gameState, {playerId: player.id});
        });
    }

    function start(gameState) {
        gameState.phaseTimer = PHASE_DURATION;
        createWorms(gameState);  //TODO: Might want to do this and setWormStartingPos together
        setWormStartingPositions(gameState, gameState.worms, gameState.map);
        setWormStartingDirections(gameState, gameState.worms);
    }

    function update(gameState, deltaTime) {
        if (!isActive(gameState)) {
            return;
        }

        playerHandler.update(gameState, deltaTime);
        coreFunctions.updateWorms(gameState, deltaTime);
        gameState.phaseTimer -= deltaTime;

        if (!isActive(gameState)) {
            end(gameState);
        }
    }

    function end(gameState) {
        //TODO set not startPhase
    }

    function isActive(gameState) {
        return gameState.phaseTimer > 0;
    }

    return {
        type: startPhase.type,
        start: start,
        update: update,
        isActive: isActive
    };
};
