var STEERING = require("../player.js").steering;
var clone = require("../../util/clone.js");
var shapeToGridConverter = require("../../geometry/shape-to-grid-converter.js").createShapeToGridConverter();
var RoundingModes = require("../../geometry/shape-to-grid-converter.js").RoundingModes;
var PlayArea = require("../../play-area/play-area.js");
var Trajectory = require("../../geometry/trajectory/trajectory.js");
var Curve = require("../../geometry/trajectory/curve.js");

module.exports = function PathCheckerAI(game, collisionHandler, trajectoryHandler, random) {

    var timeUntilNextSimulation = 0;
    var trajectory = [];
    var lastUpdate = Date.now();
    var SIMULATION_DELTA = 0.15;
    var simulationCollision = false;

    collisionHandler.on(collisionHandler.events.WORM_MAP_COLLISION, function onWormMapCollision(gameState, player, worm) {
        simulationCollision = true;
    });

    function update(gameState, player) {
        var deltaTime = (Date.now() - lastUpdate) / 1000.0;
        timeUntilNextSimulation -= deltaTime;
        var worm = player.worms[0];
        if (timeUntilNextSimulation < 0) {
            if (worm.speed === 0) {
                trajectory = getBestStraightTrajectory(gameState, worm);
            } else {
                trajectory = getBestSunFanTrajectory(gameState, worm);
            }
            timeUntilNextSimulation = random.randInt(200, 300) / 1000.0;
        } else {
            if (worm.speed > 0) {
                trajectoryHandler.removeDeltaTime(trajectory, deltaTime);
            }
        }
        if (trajectory.length > 0) {
            if (trajectory[0].turningSpeed < 0) {
                game.setPlayerSteering(player, STEERING.LEFT);
            } else if (trajectory[0].turningSpeed > 0) {
                game.setPlayerSteering(player, STEERING.RIGHT);
            } else {
                game.setPlayerSteering(player, STEERING.STRAIGHT);
            }
        }
        player.worms.forEach(function (worm) {
            worm.trajectory = trajectory;
        });
        lastUpdate = Date.now();
    }

    function getBestSunFanTrajectory(gameState, worm) {
        var trajectories = generateSunFanTrajectories(worm, 20, 0.15);
        var bestTime = -1;
        var bestTrajectories = [];
        trajectories.forEach(function (trajectory) {
            var time = checkTrajectory(gameState, worm, trajectory);
            if (time > bestTime) {
                bestTime = time;
                bestTrajectories = [trajectory];
            } else if (time === bestTime) {
                bestTrajectories.push(trajectory);
            }
        });
        return random.randomElement(bestTrajectories);
    }

    function getBestStraightTrajectory(gameState, worm) {
        var trajectories = generateStraightTrajectories(worm, 20, 0.15);
        var bestTime = -1;
        var bestTrajectory = [];
        var bestDirection = 0;
        trajectories.forEach(function (trajectory) {
            var time = checkTrajectory(gameState, worm, trajectory);
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

    function generateSunFanTrajectories(worm, moves, moveTime) {
        return generateTwoStepTrajectories(moves, moveTime, worm.speed, worm.turningSpeed, worm.speed, 0);
    }

    function generateStraightTrajectories(worm, moves, moveTime) {
        return generateTwoStepTrajectories(moves, moveTime, 0, worm.turningSpeed, 50, 0);
    }

    function generateTwoStepTrajectories(moves, moveTime, speed1, turningSpeed1, speed2, turningSpeed2) {
        var trajectories = [];
        var maxTurns = Math.min(moves, Math.floor(Math.PI / moveTime / turningSpeed1));
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

    function checkTrajectory(gameState, worm, trajectory) {
        var playArea = gameState.playArea;
        var clonedWorm = clone(worm);
        var clonedHead = clone(worm.head);
        clonedWorm.head = clonedHead;
        var trajectoryTime = 0;
        var immunityDistance = 1.5 * clonedHead.boundingBox.width;
        trajectoryHandler.followTrajectory(trajectory, worm.head.x, worm.head.y, worm.direction, SIMULATION_DELTA, function checkCollision(x, y, direction, time, distanceSquared) {
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
            collisionHandler.wormMapCollisionDetection(gameState, undefined, clonedWorm);
            if (!simulationCollision) {
                // Worm collision detection
                var cells = shapeToGridConverter.convert(clonedHead, playArea, RoundingModes.INTERSECTION);
                cells.some(function (cell) {
                    var value = playArea.grid[cell];
                    if (value !== PlayArea.FREE) {
                        if (value !== clonedWorm.id || distanceSquared > immunityDistance) {
                            simulationCollision = true;
                            return true;
                        }
                    }
                });
            }
            if (simulationCollision) {
                simulationCollision = false;
                return true;
            }
            trajectoryTime = time;
            return false;
        });
        return trajectoryTime;
    }

    return {
        update: update
    };
};