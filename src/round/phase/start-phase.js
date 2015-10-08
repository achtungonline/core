var PHASE_DURATION = 2.5; // seconds

var startPhase = module.exports = {};

startPhase.type = "startPhase";

startPhase.StartPhase = function StartPhase(deps) {
    var wormFactory = deps.wormFactory;
    var shapeSpatialRelations = deps.shapeSpatialRelations;
    var mapUtils = deps.mapUtils;
    var playerUtils = deps.playerUtils;
    var wormHandler = deps.wormHandler;

    function setWormStartingPositions(worms, map) {
        function isCollidingWithWorms(worms, shape) {
            for (var i in worms) {
                var worm = worms[i];
                if (shapeSpatialRelations.intersects(worm.head, shape)) {
                    return true;
                }
            }
            return false;
        }

        function getWormHeadInsidePlayableMapArea(worm) {
            return mapUtils.getShapeRandomlyInsidePlayableArea(map, worm.head, deps.random);
        }

        var updatedWorms = [];
        playerUtils.forEachAliveWorm(worms, function (worm) {
            var newHead = getWormHeadInsidePlayableMapArea(worm);
            var counter = 0;
            while (isCollidingWithWorms(updatedWorms, newHead)) {
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

    function setWormStartingDirections(worms) {
        worms.forEach(function (worm) {
            var direction = deps.random.random() * Math.PI * 2;
            wormHandler.setDirection(worm, direction);
        });
    }

    function immobilizeWorms(worms) {
        playerUtils.forEachAliveWorm(worms, function (worm) {
            wormHandler.setSpeed(worm, 0);
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
        setWormStartingPositions(gameState.worms, gameState.map);
        setWormStartingDirections(gameState.worms);
        immobilizeWorms(gameState.worms);
    }

    function update(gameState, deltaTime) {
        if (!isActive(gameState)) {
            return;
        }

        playerUtils.forEachAliveWorm(gameState.worms, function (worm) {
            wormHandler.update(gameState, deltaTime, worm);
        });

        gameState.phaseTimer -= deltaTime;

        if (!isActive(gameState)) {
            end(gameState);
        }
    }

    function end(gameState) {
        playerUtils.forEachAliveWorm(gameState.worms, function setOriginalPlayerSpeeds(worm) {
            wormHandler.setSpeed(worm, worm.defaultSpeed);
        });
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
