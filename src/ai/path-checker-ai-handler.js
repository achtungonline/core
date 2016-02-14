var STEERING = require("../core/player/player.js").steering;
var clone = require("../core/util/clone.js");
var shapeToGridConverter = require("../core/geometry/shape-to-grid-converter.js").createShapeToGridConverter();
var RoundingModes = require("../core/geometry/shape-to-grid-converter.js").RoundingModes;
var PlayArea = require("../core/play-area/play-area.js");
var Trajectory = require("../core/geometry/trajectory/trajectory.js");
var Curve = require("../core/geometry/trajectory/curve.js");
var random = require("../core/util/random.js");
var gameStateFunctions = require("../core/game-state-functions.js");

var playerUtils = require("../core/player/player-utils.js");

var TYPE = "pathCheckerAi";

var SIMULATION_DELTA = 0.15;

//TODO Remove Player from all (most) functions
module.exports = function PathCheckerAI(game, collisionHandler, trajectoryHandler) {
    var seedState = {seed: 10}; //TODO: Local state. AI needs its own "state" with a seed. In order to not affect the core seed

    collisionHandler.on(collisionHandler.events.WORM_MAP_COLLISION, function onWormMapCollision(gameState, worm) {
        playerUtils.getPlayerById(gameState.players, worm.playerId).aiData.simulationCollision = true;
    });

    function update(gameState, deltaTime, player) {
        var aiData = player.aiData;

        function setDefaultDataValues() {

            aiData.timeUntilNextSimulation = 0;
            aiData.trajectory = [];
            aiData.simulationCollision = false;
        }

        if (aiData.trajectory === undefined) {
            setDefaultDataValues();
        }
        aiData.timeUntilNextSimulation -= deltaTime;
        var aliveWorms = playerUtils.getAliveWorms(gameState.worms, player.id);
        if (aliveWorms.length === 0) {
            return;
        }
        var worm = aliveWorms[0];

        if (aiData.timeUntilNextSimulation < 0) {
            if (gameStateFunctions.getWormSpeed(gameState, worm.id) === 0) {
                aiData.trajectory = getBestStraightTrajectory(gameState, player, worm);
            } else {
                aiData.trajectory = getBestSunFanTrajectory(gameState, player, worm);
            }
            aiData.timeUntilNextSimulation = random.randInt(seedState, 200, 300) / 1000.0;
        } else {
            if (gameStateFunctions.getWormSpeed(gameState, worm.id) > 0) {
                trajectoryHandler.removeDeltaTime(aiData.trajectory, deltaTime);
            }
        }
        if (aiData.trajectory.length > 0) {
            // Make sure that the worm follows the generated directory. If the worms turning speed is negative (switched key bindings), we need to take that in consideration when deciding where we should turn.
            if ((aiData.trajectory[0].turningSpeed * gameStateFunctions.getWormTurningSpeed(gameState, worm.id)) < 0) {
                game.setPlayerSteering(player, STEERING.LEFT);
            } else if (aiData.trajectory[0].turningSpeed * gameStateFunctions.getWormTurningSpeed(gameState, worm.id) > 0) {
                game.setPlayerSteering(player, STEERING.RIGHT);
            } else {
                game.setPlayerSteering(player, STEERING.STRAIGHT);
            }
        }
        playerUtils.forEachAliveWorm(gameState.worms, function (worm) {
            worm.trajectory = aiData.trajectory;
        }, player.id);
    }

    function getBestSunFanTrajectory(gameState, player, worm) {
        var trajectories = generateSunFanTrajectories(gameState, worm, 20, 0.15);
        var bestTime = -1;
        var bestTrajectories = [];
        trajectories.forEach(function (trajectory) {
            var time = checkTrajectory(gameState, player, worm, trajectory);
            if (time > bestTime) {
                bestTime = time;
                bestTrajectories = [trajectory];
            } else if (time === bestTime) {
                bestTrajectories.push(trajectory);
            }
        });
        return random.randomElement(seedState, bestTrajectories);
    }

    function getBestStraightTrajectory(gameState, player, worm) {
        var trajectories = generateStraightTrajectories(gameState, worm, 20, 0.15);
        var bestTime = -1;
        var bestTrajectory = [];
        var bestDirection = 0;
        trajectories.forEach(function (trajectory) {
            var time = checkTrajectory(gameState, player, worm, trajectory);
            var direction = 0;
            trajectory.forEach(function (curve) {
                direction += curve.turningSpeed * curve.duration;
            });
            if (time > bestTime || time === bestTime && Math.abs(direction) < Math.abs(bestDirection)) {
                bestTime = time;
                bestTrajectory = trajectory;
                bestDirection = direction;
            }
        });
        return bestTrajectory;
    }

    function generateSunFanTrajectories(gameState, worm, moves, moveTime) {
        return generateTwoStepTrajectories(moves, moveTime, gameStateFunctions.getWormSpeed(gameState, worm.id), gameStateFunctions.getWormTurningSpeed(gameState, worm.id), gameStateFunctions.getWormSpeed(gameState, worm.id), 0);
    }

    function generateStraightTrajectories(gameState, worm, moves, moveTime) {
        return generateTwoStepTrajectories(moves, moveTime, 0, gameStateFunctions.getWormTurningSpeed(gameState, worm.id), 50, 0);
    }

    function generateTwoStepTrajectories(moves, moveTime, speed1, turningSpeed1, speed2, turningSpeed2) {
        var trajectories = [];
        // TurningSpeed can be negative so we need to do Math.abs so we don't get negative max turns.
        var maxTurns = Math.min(moves, Math.abs(Math.floor(Math.PI / moveTime / turningSpeed1)));
        [STEERING.RIGHT, STEERING.LEFT].forEach(function (steering) {
            for (var turns = 0; turns <= maxTurns; turns++) {
                var trajectory = Trajectory();
                for (var i = 0; i < turns; i++) {
                    trajectoryHandler.addCurve(trajectory, Curve(speed1, steering * turningSpeed1, moveTime));
                }
                for (i = 0; i < moves - turns; i++) {
                    trajectoryHandler.addCurve(trajectory, Curve(speed2, steering * turningSpeed2, moveTime));
                }
                trajectories.push(trajectory);
            }
        });
        return trajectories;
    }

    function checkTrajectory(gameState, player, worm, trajectory) {
        var playArea = gameState.playArea;
        var clonedWorm = clone(worm);
        var clonedHead = clone(worm.head);
        clonedWorm.head = clonedHead;
        var trajectoryTime = 0;
        var immunityDistance = 1.5 * clonedHead.boundingBox.width;
        trajectoryHandler.followTrajectory(trajectory, worm.head.x, worm.head.y, gameStateFunctions.getWormDirection(gameState, worm.id), SIMULATION_DELTA, function checkCollision(x, y, direction, time, distanceSquared) {
            var xDiff = x - clonedHead.x;
            var yDiff = y - clonedHead.y;
            clonedHead.x += xDiff;
            clonedHead.y += yDiff;
            clonedHead.centerX += xDiff;
            clonedHead.centerY += yDiff;
            clonedHead.maxX += xDiff;
            clonedHead.maxY += yDiff;
            clonedWorm.direction = direction;

            // Map collision detection
            collisionHandler.wormMapCollisionDetection(gameState, clonedWorm);
            if (!player.aiData.simulationCollision) {
                // Worm collision detection
                var cells = shapeToGridConverter.convert(clonedHead, playArea, RoundingModes.INTERSECTION);
                cells.some(function (cell) {
                    var value = playArea.grid[cell];
                    if (value !== PlayArea.FREE) {
                        if (value !== clonedWorm.id || distanceSquared > immunityDistance) {
                            player.aiData.simulationCollision = true;
                            return true;
                        }
                    }
                });
            }
            if (player.aiData.simulationCollision) {
                player.aiData.simulationCollision = false;
                return true;
            }
            trajectoryTime = time;
            return false;
        });
        return trajectoryTime;
    }

    return {
        update: update,
        type: TYPE
    };
};
