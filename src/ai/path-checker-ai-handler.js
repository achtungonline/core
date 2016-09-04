var constants = require("../core/constants.js");
var clone = require("../core/util/clone.js");
var shapeToGridConverter = require("../core/geometry/shape-to-grid-converter.js").createShapeToGridConverter();
var shapeSpatialRelations = require("../core/geometry/shape-spatial-relations.js");
var RoundingModes = require("../core/geometry/shape-to-grid-converter.js").RoundingModes;
var random = require("../core/util/random.js");
var coreFunctions = require("../core/core-functions.js");
var gameStateFunctions = require("../core/game-state-functions.js");
var trajectoryUtil = require("../core/geometry/trajectory/trajectory-util.js");

var SIMULATION_DURATION = 2;
var SIMULATION_DELTA = 0.05;
var MIN_SLEEP_TIME = 0.2;
var MAX_SLEEP_TIME = 0.3;

module.exports = function PathCheckerAI() {

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

        if (aiData.timeUntilNextSimulation < 0) {
            if (coreFunctions.getWormSpeed(gameState, worm.id) === 0) {
                aiData.trajectory = getBestStraightTrajectory(gameState, worm);
            } else if (gameStateFunctions.hasWormEffect(gameState, worm.id, "tronTurn")) {
                aiData.trajectory = getBestTronTurnTrajectory(gameState, worm);
            } else {
                aiData.trajectory = getBestCurveTrajectory(gameState, worm);
            }
            aiData.timeUntilNextSimulation = random.randInt(gameState, MIN_SLEEP_TIME*1000, MAX_SLEEP_TIME*1000) / 1000.0;
        } else {
            if (gameStateFunctions.isInStartPhase(gameState) && coreFunctions.getWormSpeed(gameState, worm.id) > 0) {
                while (aiData.trajectory.length > 0 && deltaTime >= aiData.trajectory[0].duration) {
                    deltaTime -= aiData.trajectory[0].duration;
                    aiData.trajectory.shift();
                }
                if (aiData.trajectory.length > 0) {
                    aiData.trajectory[0].duration -= deltaTime;
                }
            }
        }
        if (aiData.trajectory.length > 0) {
            // Make sure that the worm follows the generated directory. If the worms turning speed is negative (switched key bindings), we need to take that in consideration when deciding where we should turn.
            if ((aiData.trajectory[0].turningVelocity * coreFunctions.getWormTurningSpeed(gameState, worm.id)) < 0) {
                gameStateFunctions.setPlayerSteering(gameState, player.id, constants.STEERING_LEFT);
            } else if (aiData.trajectory[0].turningVelocity * coreFunctions.getWormTurningSpeed(gameState, worm.id) > 0) {
                gameStateFunctions.setPlayerSteering(gameState, player.id, constants.STEERING_RIGHT);
            } else {
                gameStateFunctions.setPlayerSteering(gameState, player.id, constants.STEERING_STRAIGHT);
            }
        }
        gameStateFunctions.forEachAliveWorm(gameState, function (worm) {
            worm.trajectory = aiData.trajectory;
        }, player.id);
    }

    function getBestCurveTrajectory(gameState, worm) {
        var trajectories = generateCurveTrajectories(gameState, worm);
        return pickBestTrajectory(gameState, worm, trajectories);
    }

    function getBestStraightTrajectory(gameState, worm) {
        var trajectories = generateStraightTrajectories(gameState, worm);
        return pickBestTrajectory(gameState, worm, trajectories);
    }

    function getBestTronTurnTrajectory(gameState, worm) {
        var turnTime = 0.0001;
        var speed = coreFunctions.getWormSpeed(gameState, worm.id);
        var trajectories = [];

        [0, constants.STEERING_RIGHT, constants.STEERING_LEFT].forEach(function (steering) {
            var trajectory = [];
            // Turn on the spot
            trajectory.push(trajectoryUtil.createTrajectory({
                startX: worm.head.centerX,
                startY: worm.head.centerY,
                startDirection: worm.direction,
                duration: turnTime,
                speed: 0,
                turningVelocity: steering * Math.PI / 2 / turnTime
            }));
            // Go forward
            trajectory.push(trajectoryUtil.createTrajectory({
                startX: trajectory[0].endX,
                startY: trajectory[0].endY,
                startDirection: trajectory[0].endDirection,
                duration: SIMULATION_DURATION,
                speed: speed,
                turningVelocity: 0
            }));
            trajectories.push(trajectory);
        });

        return pickBestTrajectory(gameState, worm, trajectories);
    }

    function pickBestTrajectory(gameState, worm, trajectories) {
        var bestTime = -1;
        var bestTrajectories = [];
        trajectories.forEach(function (trajectory) {
            var time = checkTrajectory(gameState, worm, trajectory);
            var direction = 0;
            trajectory.forEach(function (curve) {
                direction += curve.turningSpeed * curve.duration;
            });
            if (time > bestTime) {
                bestTime = time;
                bestTrajectories = [trajectory];
            } else if (time === bestTime) {
                bestTrajectories.push(trajectory);
            }
        });
        return random.randomElement(gameState, bestTrajectories);
    }

    function generateCurveTrajectories(gameState, worm) {
        return generateTwoStepTrajectories(worm, coreFunctions.getWormSpeed(gameState, worm.id), coreFunctions.getWormTurningSpeed(gameState, worm.id), coreFunctions.getWormSpeed(gameState, worm.id), 0);
    }

    function generateStraightTrajectories(gameState, worm) {
        return generateTwoStepTrajectories(worm, 0, coreFunctions.getWormTurningSpeed(gameState, worm.id), 50, 0);
    }

    function generateTwoStepTrajectories(worm, speed1, turningSpeed1, speed2, turningSpeed2) {
        var trajectories = [];
        var moves = SIMULATION_DURATION / SIMULATION_DELTA;
        // TurningSpeed can be negative so we need to do Math.abs so we don't get negative max turns.
        var maxTurns = Math.min(moves, Math.abs(Math.floor(Math.PI / SIMULATION_DELTA / turningSpeed1)));
        [constants.STEERING_RIGHT, constants.STEERING_LEFT].forEach(function (steering) {
            for (var turns = 0; turns <= maxTurns; turns++) {
                var trajectory = [];
                var x = worm.head.centerX;
                var y = worm.head.centerY;
                var direction = worm.direction;
                if (turns > 0) {
                    trajectory.push(trajectoryUtil.createTrajectory({
                        startX: x,
                        startY: y,
                        startDirection: direction,
                        duration: turns * SIMULATION_DELTA,
                        speed: speed1,
                        turningVelocity: steering * turningSpeed1
                    }));
                    x = trajectory[0].endX;
                    y = trajectory[0].endY;
                    direction = trajectory[0].endDirection;
                }
                trajectory.push(trajectoryUtil.createTrajectory({
                    startX: x,
                    startY: y,
                    startDirection: direction,
                    duration: (moves - turns) * SIMULATION_DELTA,
                    speed: speed2,
                    turningVelocity: steering * turningSpeed2
                }));
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

        var segmentTime = 0;
        var time = 0;
        var trajectoryIndex = 0;
        var distanceTravelled = 0;
        var immunityDistance = 3*worm.head.radius;
        while (trajectoryIndex < trajectory.length) {
            segmentTime += SIMULATION_DELTA;
            distanceTravelled += SIMULATION_DELTA * trajectory[trajectoryIndex].speed;
            while (trajectoryIndex < trajectory.length - 1 && segmentTime > trajectory[trajectoryIndex].duration) {
                segmentTime -= trajectory[trajectoryIndex].duration;
                trajectoryIndex++;
            }
            var position = trajectoryUtil.followTrajectory(trajectory[trajectoryIndex], segmentTime);
            if (segmentTime >= trajectory[trajectoryIndex].duration) {
                segmentTime -= trajectory[trajectoryIndex].duration;
                trajectoryIndex++;
            }
            var xDiff = position.x - clonedHead.centerX;
            var yDiff = position.y - clonedHead.centerY;
            clonedHead.x += xDiff;
            clonedHead.y += yDiff;
            clonedHead.centerX += xDiff;
            clonedHead.centerY += yDiff;
            clonedHead.maxX += xDiff;
            clonedHead.maxY += yDiff;
            clonedWorm.direction = position.direction;

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
                        if (value !== clonedWorm.id || distanceTravelled > immunityDistance) {
                            collision = true;
                            return true;
                        }
                    }
                });
            }
            if (collision) {
                return time;
            }
            time += SIMULATION_DELTA;
        }
        return time;
    }

    return {
        update: update
    };
};
