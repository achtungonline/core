var PHASE_DURATION = 2.5; // seconds

var startPhase = module.exports = {};

startPhase.type = "startPhase";

startPhase.StartPhase = function StartPhase(deps) {
    function setPlayersStartingPositions(players, map) {
        function isCollidingWithWorms(worms, shape) {
            for (var i in worms) {
                var worm = worms[i];
                if (deps.shapeSpatialRelations.intersects(worm.head, shape)) {
                    return true;
                }
            }
            return false;
        }

        function getWormHeadInsidePlayableMapArea(worm) {
            return deps.mapUtils.getShapeRandomlyInsidePlayableArea(map, worm.head, deps.random);
        }

        var updatedWorms = [];
        deps.playerUtils.forEachAliveWorm(players, function (player, worm) {
            var newHead = getWormHeadInsidePlayableMapArea(worm);
            var counter = 0;
            while (isCollidingWithWorms(updatedWorms, newHead)) {
                if (counter > 100000) {
                    throw Error("Failed to find starting position for worm that does not collide with other worms.");
                }
                newHead = getWormHeadInsidePlayableMapArea(worm);
                counter++;
            }
            deps.wormHandler.setHead(worm, newHead);
            updatedWorms.push(worm);
        });
    }

    function setPlayersStartingDirections(players) {
        players.forEach(function (player) {
            player.worms.forEach(function (worm) {
                var direction = deps.random.random() * Math.PI * 2;
                deps.wormHandler.setDirection(worm, direction);
            });
        });
    }

    function immobilizePlayers(players) {
        deps.playerUtils.forEachAliveWorm(players, function (player, worm) {
            deps.wormHandler.setSpeed(worm, 0);
        });
    }

    function start(gameState) {
        gameState.phaseTimer= PHASE_DURATION;
        setPlayersStartingPositions(gameState.players, gameState.map);
        setPlayersStartingDirections(gameState.players);
        immobilizePlayers(gameState.players);
    }

    function update(gameState, deltaTime) {
        if (!isActive(gameState)) {
            return;
        }

        deps.playerUtils.forEachAliveWorm(gameState.players, function (player, worm) {
            deps.wormHandler.update(gameState, deltaTime, player, worm);
        });

        gameState.phaseTimer -= deltaTime;

        if(!isActive(gameState)) {
            end(gameState);
        }
    }

    function end(gameState) {
        deps.playerUtils.forEachAliveWorm(gameState.players, function setOriginalPlayerSpeeds(player, worm) {
            deps.wormHandler.setSpeed(worm, worm.defaultSpeed);
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
