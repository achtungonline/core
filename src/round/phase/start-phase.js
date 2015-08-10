var PHASE_DURATION = 2.5; // seconds

var startPhase = module.exports = {};

startPhase.type = "startPhase";

startPhase.StartPhase = function StartPhase(wormHandler, shapeModifierI, shapeSpatialRelations, mapUtils, playerUtils) {
    var runtime;
    var type = startPhase.type;
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
            var newWormPos = mapUtils.getRandomPositionInsidePlayableArea(map, worm.head);
            return shapeModifierI.setPosition(worm.head, newWormPos.x, newWormPos.y);
        }


        var updatedWorms = [];
        playerUtils.forEachAliveWorm(players, function (player, worm) {
            var newHead = getWormHeadInsidePlayableMapArea(worm);
            var counter = 0;
            while (isCollidingWithWorms(updatedWorms, newHead)) {
                if (counter > 100000) {
                    throw Error("Failed to find starting position for worm that does not collide with other worms.")
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
                var direction = Math.random() * Math.PI * 2;
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

    function start(players, map) {
        runtime = PHASE_DURATION;
        setPlayersStartingPositions(players, map);
        setPlayersStartingDirections(players);
        immobilizePlayers(players);
    }

    function update(deltaTime, players, map) {
        if (!isRunning()) {
            return;
        }

        playerUtils.forEachAliveWorm(players, function (player, worm) {
            wormHandler.update(deltaTime, players, map, player, worm);
        });

        runtime -= deltaTime;
    }

    function end(players, map) {
        playerUtils.forEachAliveWorm(players, function setOriginalPlayerSpeeds(player, worm) {
            wormHandler.setSpeed(worm, originalWormSpeeds[worm.id]);
        });
    }

    function isRunning() {
        return (runtime !== undefined && runtime > 0);
    }

    return {
        type: type,
        start: start,
        update: update,
        isRunning: isRunning,
        end: end
    }
};
