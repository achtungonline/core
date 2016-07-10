var shapeModifierI = require("./../geometry/shape-modifier-immutable-factory.js")().create();

var PHASE_DURATION = 2.5; // seconds

var startPhase = module.exports = {};
var random = require("./../util/random.js");

startPhase.type = "startPhase";

startPhase.StartPhase = function StartPhase(deps) {
    var wormFactory = deps.wormFactory;
    var shapeSpatialRelations = deps.shapeSpatialRelations;
    var mapUtils = deps.mapUtils;
    var playerUtils = deps.playerUtils;
    var wormHandler = deps.wormHandler;
    var playerHandler = deps.playerHandler;

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
            return mapUtils.getShapeRandomlyInsidePlayableArea(gameState, map, worm.head, 50);
        }

        var updatedWorms = [];
        playerUtils.forEachAliveWorm(worms, function (worm) {
            var newHead = getWormHeadInsidePlayableMapArea(worm);
            var counter = 0;
            while (isTooCloseToOtherWorms(updatedWorms, newHead)) {
                if (counter > 100000) {
                    throw Error("Failed to find starting position for worm that does not collide with other worms.");
                }
                newHead = getWormHeadInsidePlayableMapArea(worm);
                counter++;
            }
            wormHandler.setHead(worm, newHead);
            updatedWorms.push(worm);
        });
    }

    function setWormStartingDirections(gameState, worms) {
        worms.forEach(function (worm) {
            var direction = random.random(gameState) * Math.PI * 2;
            wormHandler.setDirection(worm, direction);
        });
    }

    function createWorms(gameState) {
        playerUtils.forEachAlivePlayer(gameState.players, function (player) {
            gameState.worms.push(wormFactory.create(player.id));
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
        playerUtils.forEachAliveWorm(gameState.worms, function (worm) {
            wormHandler.update(gameState, deltaTime, worm);
        });

        gameState.phaseTimer -= deltaTime;

        if (!isActive(gameState)) {
            end(gameState);
        }
    }

    function end(gameState) {
        //TODO set not startPhase
        //playerUtils.forEachAliveWorm(gameState.worms, function setOriginalPlayerSpeeds(worm) {
        //    wormHandler.setSpeed(worm, worm.defaultSpeed);
        //});
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
