var constants = require("../core/constants.js");
var clone = require("../core/util/clone.js");
var shapeToGridConverter = require("../core/geometry/shape-to-grid-converter.js").createShapeToGridConverter();
var shapeSpatialRelations = require("../core/geometry/shape-spatial-relations.js");
var RoundingModes = require("../core/geometry/shape-to-grid-converter.js").RoundingModes;
var random = require("../core/util/random.js");
var coreFunctions = require("../core/core-functions.js");
var gameStateFunctions = require("../core/game-state-functions.js");
var trajectoryHandler = require("../core/geometry/trajectory/trajectory-handler.js")();

var TYPE = "pathCheckerAi";

var SIMULATION_DELTA = 0.15;

function createCurve(speed, turningSpeed, duration) {
    return {
        speed,
        turningSpeed,
        duration
    }
}

//TODO Remove Player from all (most) functions
module.exports = function PathCheckerAI() {

    var seedState = {seed: 10}; //TODO: Local state. AI needs its own "state" with a seed. In order to not affect the core seed

    function update(gameState, deltaTime, player) {
        var aiData = player.aiData;

        if (aiData.trajectory === undefined) {
            aiData.timeUntilNextSimulation = 0;
            aiData.trajectory = [];
        }

        aiData.timeUntilNextSimulation -= deltaTime;
        var aliveWorms = gameStateFunctions.getAliveWorms(gameState, player.id);
        if (aliveWorms.length === 0) {
            return;
        }
        var worm = aliveWorms[0];

        function setSteering(steering) {
            //TODO Will have to check this again when we have multiple worms
            if (gameStateFunctions.hasWormEffect(gameState, worm.id, "tronTurn")) {
                // If we have tron turn, the AI has to "Press and Release" in order to steer, otherwise it won't turn
                if (player.steering === constants.STEERING_STRAIGHT) {
                    gameStateFunctions.setPlayerSteering(gameState, player.id, steering);
                } else {
                    gameStateFunctions.setPlayerSteering(gameState, player.id, constants.STEERING_STRAIGHT);
                }
            } else {
                gameStateFunctions.setPlayerSteering(gameState, player.id, steering);
            }
        }

        if (aiData.timeUntilNextSimulation < 0) {
            if (coreFunctions.getWormSpeed(gameState, worm.id) === 0) {
                aiData.trajectory = getBestStraightTrajectory(gameState, player, worm);
            } else if (gameStateFunctions.hasWormEffect(gameState, worm.id, "tronTurn")) {
                aiData.trajectory = getBestTronTurnTrajectory(gameState, player, worm);
            } else {
                aiData.trajectory = getBestSunFanTrajectory(gameState, player, worm);
            }
            aiData.timeUntilNextSimulation = random.randInt(seedState, 200, 300) / 1000.0;
        } else {
            if (coreFunctions.getWormSpeed(gameState, worm.id) > 0) {
                trajectoryHandler.removeDeltaTime(aiData.trajectory, deltaTime);
            }
        }
        if (aiData.trajectory.length > 0) {
            // Make sure that the worm follows the generated directory. If the worms turning speed is negative (switched key bindings), we need to take that in consideration when deciding where we should turn.
            if ((aiData.trajectory[0].turningSpeed * coreFunctions.getWormTurningSpeed(gameState, worm.id)) < 0) {
                setSteering(constants.STEERING_LEFT);
            } else if (aiData.trajectory[0].turningSpeed * coreFunctions.getWormTurningSpeed(gameState, worm.id) > 0) {
                setSteering(constants.STEERING_RIGHT);
            } else {
                setSteering(constants.STEERING_STRAIGHT);
            }
        }
        gameStateFunctions.forEachAliveWorm(gameState, function (worm) {
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

    function getBestTronTurnTrajectory(gameState, player, worm) {
        //var trajectories = generateStraightTrajectories(gameState, worm, 20, 0.15);
        var moves = 20;
        var moveTime = 0.15;
        var speed = coreFunctions.getWormSpeed(gameState, worm.id);
        var trajectories = [];

        [0, constants.STEERING_RIGHT, constants.STEERING_LEFT].forEach(function (steering) {
            var trajectory = [];
            trajectoryHandler.addCurve(trajectory, createCurve(0, steering * Math.PI / 2, moveTime));
            for (var i = 0; i < moves; i++) {
                trajectoryHandler.addCurve(trajectory, createCurve(speed, 0, moveTime));
            }
            trajectories.push(trajectory);
        });


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
        return generateTwoStepTrajectories(moves, moveTime, coreFunctions.getWormSpeed(gameState, worm.id), coreFunctions.getWormTurningSpeed(gameState, worm.id), coreFunctions.getWormSpeed(gameState, worm.id), 0);
    }

    function generateStraightTrajectories(gameState, worm, moves, moveTime) {
        return generateTwoStepTrajectories(moves, moveTime, 0, coreFunctions.getWormTurningSpeed(gameState, worm.id), 50, 0);
    }

    function generateTwoStepTrajectories(moves, moveTime, speed1, turningSpeed1, speed2, turningSpeed2) {
        var trajectories = [];
        // TurningSpeed can be negative so we need to do Math.abs so we don't get negative max turns.
        var maxTurns = Math.min(moves, Math.abs(Math.floor(Math.PI / moveTime / turningSpeed1)));
        [constants.STEERING_RIGHT, constants.STEERING_LEFT].forEach(function (steering) {
            for (var turns = 0; turns <= maxTurns; turns++) {
                var trajectory = [];
                for (var i = 0; i < turns; i++) {
                    trajectoryHandler.addCurve(trajectory, createCurve(speed1, steering * turningSpeed1, moveTime));
                }
                for (i = 0; i < moves - turns; i++) {
                    trajectoryHandler.addCurve(trajectory, createCurve(speed2, steering * turningSpeed2, moveTime));
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
        trajectoryHandler.followTrajectory(trajectory, worm.head.x, worm.head.y, coreFunctions.getWormDirection(gameState, worm.id), SIMULATION_DELTA, function checkCollision(x, y, direction, time, distanceSquared) {
            var xDiff = x - clonedHead.x;
            var yDiff = y - clonedHead.y;
            clonedHead.x += xDiff;
            clonedHead.y += yDiff;
            clonedHead.centerX += xDiff;
            clonedHead.centerY += yDiff;
            clonedHead.maxX += xDiff;
            clonedHead.maxY += yDiff;
            clonedWorm.direction = direction;

            var collision = false;
            // Map collision detection
            if (!shapeSpatialRelations.contains(gameState.map.shape, clonedWorm.head)) {
                collision = true;
            }
            if (!collision) {
                // Worm collision detection
                var cells = shapeToGridConverter.convert(clonedHead, playArea, RoundingModes.INTERSECTION);
                cells.some(function (cell) {
                    var value = playArea.grid[cell];
                    if (value !== constants.PLAY_AREA_FREE) {
                        if (value !== clonedWorm.id || distanceSquared > immunityDistance) {
                            collision = true;
                            return true;
                        }
                    }
                });
            }
            if (collision) {
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
