var STEERING = require("../player.js").steering;
var clone = require("../../util/clone.js");
var shapeToGridConverter = require("../../geometry/shape-to-grid-converter.js").createShapeToGridConverter();
var RoundingModes = require("../../geometry/shape-to-grid-converter.js").RoundingModes;
var PlayArea = require("../../play-area/play-area.js");

module.exports = function PathCheckerAI(game, collisionHandler) {

    var timeUntilNextSimulation = 0;
    var trajectory = [];
    var lastUpdate = Date.now();
    var SIMULATION_DELTA = 0.15;
    var simulationCollision = false;

    collisionHandler.on(collisionHandler.events.WORM_MAP_COLLISION, function onWormMapCollision(gameState, player, worm) {
        simulationCollision = true;
    });

    function randInt (low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    }

    function update(gameState, player) {
        var deltaTime = (Date.now() - lastUpdate) / 1000.0;
        timeUntilNextSimulation -= deltaTime;
        var worm = player.worms[0];
        if (timeUntilNextSimulation < 0) {
            var trajectories = generateSunFanTrajectories(worm, 20, 0.15);
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
            trajectory = bestTrajectories[randInt(0, bestTrajectories.length)];
            timeUntilNextSimulation = randInt(200, 300) / 1000.0;
        } else {
            if (deltaTime > 0 && trajectory.length > 0) {
                while (trajectory.length > 0 && deltaTime >= trajectory[0].time) {
                    deltaTime -= trajectory[0].time;
                    trajectory.shift();
                }
                if (trajectory.length > 0) {
                    trajectory[0].time -= deltaTime;
                }
            }
        }
        if (trajectory.length > 0) {
            game.setPlayerSteering(player, trajectory[0].steering);
        }
        player.worms.forEach(function (worm) {
            worm.trajectory = trajectory;
        });
        lastUpdate = Date.now();
    }

    function generateSunFanTrajectories(worm, moves, moveTime) {
        var trajectories = [];
        var maxTurns = Math.min(moves, Math.floor(Math.PI/moveTime/worm.turningSpeed));
        [STEERING.RIGHT, STEERING.LEFT].forEach(function (steering) {
            for (var turns = 0; turns <= maxTurns; turns++) {
                var trajectory = [];
                for (var i = 0; i < turns; i++) {
                    trajectory.push({steering: steering, time: moveTime});
                }
                for (i = 0; i < moves - turns; i++) {
                    trajectory.push({steering: STEERING.STRAIGHT, time: moveTime});
                }
                trajectories.push(trajectory);
            }
        });
        return trajectories;
    }

    function randomizeTrajectory(worm, moves, moveTime) {
        var trajectory = [];
        var totalTurn = 0;
        for (var i = 0; i < moves; i++) {
            var possibleSteering= [STEERING.STRAIGHT];
            if (totalTurn + worm.turningSpeed*moveTime <= Math.PI) {
                possibleSteering.push(STEERING.RIGHT);
                possibleSteering.push(STEERING.LEFT);
            }
            var steering = possibleSteering[randInt(0, possibleSteering.length)];
            if (steering !== STEERING.STRAIGHT) {
                totalTurn += worm.turningSpeed*moveTime;
            }
            trajectory.push({steering: steering, time: moveTime});
        }
        return trajectory;
    }

    function checkTrajectory(gameState, player, worm, trajectory) {
        var clonedWorm = clone(worm);
        clonedWorm.head = clone(worm.head);
        var time = 0;
        for (var i = 0; i < trajectory.length; i++) {
            if (simulateMove(gameState, player, clonedWorm, trajectory[i], i !== 0)) {
                time += trajectory[i].time;
            } else {
                break;
            }
        }
        return time;
    }

    function simulateMove(gameState, player, worm, move, checkSelfCollision) {
        var playArea = gameState.playArea;
        for (var step = 0; step < move.time / SIMULATION_DELTA; step++) {
            worm.direction += move.steering * worm.turningSpeed * SIMULATION_DELTA;
            var xDiff = Math.cos(worm.direction) * worm.speed * SIMULATION_DELTA;
            var yDiff = Math.sin(worm.direction) * worm.speed * SIMULATION_DELTA;
            worm.head.x += xDiff;
            worm.head.y += yDiff;
            worm.head.centerX += xDiff;
            worm.head.centerY += yDiff;
            worm.head.maxX += xDiff;
            worm.head.maxY += yDiff;

            // Map collision detection
            collisionHandler.wormMapCollisionDetection(gameState, player, worm);
            if (!simulationCollision) {
                // Worm collision detection
                var cells = shapeToGridConverter.convert(worm.head, playArea, RoundingModes.INTERSECTION);
                cells.forEach(function (cell) {
                    var value = playArea.grid[cell];
                    if (value !== PlayArea.FREE) {
                        if (value !== worm.id || checkSelfCollision) {
                            simulationCollision = true;
                        }
                    }
                });
            }
            if (simulationCollision) {
                simulationCollision = false;
                return false;
            }
        }
        return true;
    }

    return {
        update: update
    }

};