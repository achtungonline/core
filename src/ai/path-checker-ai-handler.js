import * as constants from "../core/constants.js";
import clone from "../core/util/clone.js";
import * as shapeToGridConverterMaker from "../core/geometry/shape-to-grid-converter.js";
import * as shapeSpatialRelations from "../core/geometry/shape-spatial-relations.js";
import * as random from "../core/util/random.js";
import * as coreFunctions from "../core/core-functions.js";
import * as gameStateFunctions from "../core/game-state-functions.js";
import * as trajectoryUtil from "../core/geometry/trajectory/trajectory-util.js";

var RoundingModes = shapeToGridConverterMaker.RoundingModes;
var shapeToGridConverter = shapeToGridConverterMaker.createShapeToGridConverter();

var SIMULATION_DURATION = 2;
var SIMULATION_DELTA = 0.05;
var SEARCH_DIRECTION_VELOCITY = 7*Math.PI;

export default function PathCheckerAI() {

    function update(gameState, deltaTime, player) {
        var aiData = player.aiData;

        if (aiData.trajectory === undefined) {
            aiData.trajectory = [];
            aiData.searchDirection = 0;
        }

        var aliveWorms = gameStateFunctions.getAliveWorms(gameState, player.id);
        if (aliveWorms.length === 0) {
            return;
        }
        var worm = aliveWorms[0];

        aiData.searchDirection += deltaTime * SEARCH_DIRECTION_VELOCITY;
        while (aiData.searchDirection > Math.PI) {
            aiData.searchDirection -= 2 * Math.PI;
        }

        // Trim the old trajectory
        while (aiData.trajectory.length > 0 && deltaTime >= aiData.trajectory[0].duration) {
            deltaTime -= aiData.trajectory[0].duration;
            aiData.trajectory.shift();
        }
        if (aiData.trajectory.length > 0) {
            aiData.trajectory[0].duration -= deltaTime;
        }

        var oldTrajectoryTime = checkTrajectory(gameState, worm, aiData.trajectory);
        // Don't update trajectory if the old one is fine, or the movement will be jerky
        if (oldTrajectoryTime < 3 / 4 * SIMULATION_DURATION) {
            // Check if a random trajectory works better
            var randomTrajectory = getRandomTrajectory(gameState, worm);
            var randomTrajectoryTime = checkTrajectory(gameState, worm, randomTrajectory);
            if (randomTrajectoryTime > oldTrajectoryTime) {
                aiData.trajectory = randomTrajectory;
                oldTrajectoryTime = randomTrajectoryTime;
            }

            // Use angle scan to get out of tricky situations. Random has priority if both trajectories work, since this will make the bot less predictable
            var angleTrajectory = getTrajectoryWithAngle(gameState, worm, aiData.searchDirection);
            var angleTrajectoryTime = checkTrajectory(gameState, worm, angleTrajectory);
            if (angleTrajectoryTime > oldTrajectoryTime) {
                aiData.trajectory = angleTrajectory;
            }
        }

        // Follow trajectory
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
    }

    function getRandomTrajectory(gameState, worm) {
        if (gameStateFunctions.isInStartPhase(gameState) || coreFunctions.getWormSpeed(gameState, worm.id) === 0) {
            return getRandomTwoStepTrajectory(gameState, worm, 0, coreFunctions.getWormTurningSpeed(gameState, worm.id), 50, 0);
        } else if (gameStateFunctions.hasWormEffect(gameState, worm.id, "tronTurn")) {
            return random.randomElement(gameState, generateTronTurnTrajectories(gameState, worm));
        } else {
            return getRandomTwoStepTrajectory(gameState, worm, coreFunctions.getWormSpeed(gameState, worm.id), coreFunctions.getWormTurningSpeed(gameState, worm.id), coreFunctions.getWormSpeed(gameState, worm.id), 0);
        }
    }

    function getTrajectoryWithAngle(gameState, worm, angle) {
        if (gameStateFunctions.isInStartPhase(gameState) || coreFunctions.getWormSpeed(gameState, worm.id) === 0) {
            return getTwoStepTrajectoryWithAngle(worm, angle, 0, coreFunctions.getWormTurningSpeed(gameState, worm.id), 50, 0);
        } else if (gameStateFunctions.hasWormEffect(gameState, worm.id, "tronTurn")) {
            return random.randomElement(gameState, generateTronTurnTrajectories(gameState, worm));
        } else {
            return getTwoStepTrajectoryWithAngle(worm, angle, coreFunctions.getWormSpeed(gameState, worm.id), coreFunctions.getWormTurningSpeed(gameState, worm.id), coreFunctions.getWormSpeed(gameState, worm.id), 0);
        }
    }

    function getRandomTwoStepTrajectory(gameState, worm, speed1, turningSpeed1, speed2, turningSpeed2) {
        var angle = random.random(gameState) * 2 * Math.PI - Math.PI;
        return getTwoStepTrajectoryWithAngle(worm, angle, speed1, turningSpeed1, speed2, turningSpeed2);
    }

    function getTwoStepTrajectoryWithAngle(worm, angle, speed1, turningSpeed1, speed2, turningSpeed2) {
        var turnDuration = Math.abs(angle / turningSpeed1);
        var steering = constants.STEERING_STRAIGHT;
        if (angle < 0) {
            steering = constants.STEERING_LEFT;
        } else if (angle > 0) {
            steering = constants.STEERING_RIGHT;
        }
        var trajectory = [];
        var x = worm.centerX;
        var y = worm.centerY;
        var direction = worm.direction;
        trajectory.push(trajectoryUtil.createTrajectory({
            startX: x,
            startY: y,
            startDirection: direction,
            duration: turnDuration,
            speed: speed1,
            turningVelocity: steering * turningSpeed1
        }));
        x = trajectory[0].endX;
        y = trajectory[0].endY;
        direction = trajectory[0].endDirection;
        trajectory.push(trajectoryUtil.createTrajectory({
            startX: x,
            startY: y,
            startDirection: direction,
            duration: SIMULATION_DURATION - turnDuration,
            speed: speed2,
            turningVelocity: steering * turningSpeed2
        }));
        return trajectory;
    }

    function generateTronTurnTrajectories(gameState, worm) {
        var turnTime = 0.0001;
        var speed = coreFunctions.getWormSpeed(gameState, worm.id);
        var trajectories = [];

        [0, constants.STEERING_RIGHT, constants.STEERING_LEFT].forEach(function (steering) {
            var trajectory = [];
            // Turn on the spot
            trajectory.push(trajectoryUtil.createTrajectory({
                startX: worm.centerX,
                startY: worm.centerY,
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
        return trajectories;
    }

    function checkTrajectory(gameState, worm, trajectory) {
        var playArea = gameState.playArea;

        var wormRadius = coreFunctions.getWormRadius(gameState, worm.id);
        var segmentTime = 0;
        var time = 0;
        var trajectoryIndex = 0;
        var distanceTravelled = 0;
        var immunityDistance = constants.IMMUNITY_DISTANCE_MULTIPLIER * worm.radius;
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

            var collision = false;
            // Map collision detection
            if (!gameStateFunctions.hasWormEffect(gameState, worm.id, "wallHack") && !shapeSpatialRelations.contains(gameState.map.shape, {centerX: position.x, centerY: position.y, radius: wormRadius})) {
                collision = true;
            }
            if (!collision) {
                // Worm collision detection
                var cells = shapeToGridConverter.convert({centerX: position.x, centerY: position.y, radius: wormRadius}, playArea, RoundingModes.INTERSECTION);
                collision = cells.some(function (cell) {
                    var value = playArea.grid[cell];
                    if (value !== constants.PLAY_AREA_FREE) {
                        if (value.indexOf(worm.id) === -1 //TODO Needs to get improved. Or just refactor when we dont have playArea left
                            || worm.distanceTravelled + distanceTravelled - worm.distanceTravelledFromCells[cell] > immunityDistance) {
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
