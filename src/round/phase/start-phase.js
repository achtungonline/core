var PHASE_DURATION = 2.5; // seconds

var startPhase = module.exports = {};

startPhase.type = "startPhase";

startPhase.StartPhase = function StartPhase(wormHandler, shapeModifierI, shapeSpatialRelations, mapUtils, playerUtils, random) {
    var originalWormSpeeds = []; //TODO: Should be removed, replaced with immobilize effect/powerup

    function setPlayersStartingPositions(players, map) {
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
            var newWormPos = mapUtils.getRandomPositionInsidePlayableArea(map, worm.head, random);
            return shapeModifierI.setPosition(worm.head, newWormPos.x, newWormPos.y);
        }


        var updatedWorms = [];
        playerUtils.forEachAliveWorm(players, function (player, worm) {
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

    function setPlayersStartingDirections(players) {
        players.forEach(function (player) {
            player.worms.forEach(function (worm) {
                var direction = random.random() * Math.PI * 2;
                wormHandler.setDirection(worm, direction);
            });
        });
    }

    function immobilizePlayers(players) {
        playerUtils.forEachAliveWorm(players, function (player, worm) {
            originalWormSpeeds[worm.id] = worm.speed;
            wormHandler.setSpeed(worm, 0);
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

        playerUtils.forEachAliveWorm(gameState.players, function (player, worm) {
            wormHandler.update(gameState, deltaTime, player, worm);
        });

        gameState.phaseTimer -= deltaTime;

        if(!isActive(gameState)) {
            end(gameState);
        }
    }

    function end(gameState) {
        playerUtils.forEachAliveWorm(gameState.players, function setOriginalPlayerSpeeds(player, worm) {
            wormHandler.setSpeed(worm, originalWormSpeeds[worm.id]);
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
