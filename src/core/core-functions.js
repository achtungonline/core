var constants = require("./constants.js");
var gameStateFunctions = require("./game-state-functions.js");
var shapeSpatialRelations = require("./geometry/shape-spatial-relations.js");
var shapeModifierI = require("./geometry/shape-modifier-immutable.js");
var random = require("./util/random.js");
var clone = require("./util/clone.js");
var shapeFactory = require("./geometry/shape-factory.js");
var trajectoryUtil = require("./geometry/trajectory/trajectory-util.js");
var ShapeToGridConverter = require("./geometry/shape-to-grid-converter.js");
var shapeToGridConverter = ShapeToGridConverter.createShapeToGridConverter();

function activatePowerUp(gameState, powerUpId, wormId) {
    var index = gameState.powerUps.findIndex(powerUp => powerUp.id === powerUpId);
    var powerUp = gameState.powerUps[index];
    var effect = constants.effectDefinitions[powerUp.effectType].activate({
        gameState,
        strength: powerUp.effectStrength,
        duration: powerUp.effectDuration,
        wormId,
        affects: powerUp.affects
    });
    if (effect) {
        effect.name = powerUp.name;
        if (powerUp.affects === "self" || powerUp.affects === "all") {
            gameStateFunctions.addEffect(gameState, effect);
        }
        if (powerUp.affects === "others" || powerUp.affects === "all") {
            gameStateFunctions.getAliveEnemyWorms(gameState, wormId).forEach(function (worm) {
                var clonedEffect = clone(effect);
                clonedEffect.wormId = worm.id;
                gameStateFunctions.addEffect(gameState, clonedEffect);
            })
        }
    }
    gameStateFunctions.removePowerUp(gameState, powerUpId);
}

function getShapeRandomlyInsidePlayableArea(gameState, map, shape, minDistance) {
    function getRandomPositionInsidePlayableArea(gameState, map, shape, minDistance) {
        function intersectsBlockingShapes(map, shape) {
            for (var i = 0; i < map.blockingShapes.length; i++) {
                if (shapeSpatialRelations.intersects(map.blockingShapes[i], shape)) {
                    return true;
                }
            }
            return false;
        }

        minDistance = minDistance || 0;
        var shrunkenMapShape = shapeModifierI.changeSize(map.shape, -minDistance, -minDistance);
        var pos = {};
        var i = 0;
        var shapeWithNewPos = shape;
        while (i < 100000) {
            pos.x = random.random(gameState) * map.width;
            pos.y = random.random(gameState) * map.height;
            shapeWithNewPos = shapeModifierI.setPosition(shapeWithNewPos, pos.x, pos.y);
            if (shapeSpatialRelations.contains(shrunkenMapShape, shapeWithNewPos) && !intersectsBlockingShapes(map, shapeWithNewPos)) {
                return pos;
            }
            i++;
        }
        throw Error("Failed to find a position inside playable area for the given shape");
    }


    var newPos = getRandomPositionInsidePlayableArea(gameState, map, shape, minDistance);
    return shapeModifierI.setPosition(shape, newPos.x, newPos.y);
}

function getWormDirection(gameState, wormId) {
    return transformValueUsingEffects(gameState, wormId, gameStateFunctions.getWorm(gameState, wormId).direction, 'changeDirection');
}

function getWormSize(gameState, wormId) {
    var newSize = transformValueUsingEffects(gameState, wormId, gameStateFunctions.getWorm(gameState, wormId).size, 'changeSize');
    return Math.max(1, newSize);
}

function getWormSpeed(gameState, wormId) {
    var newSpeed = transformValueUsingEffects(gameState, wormId, gameStateFunctions.getWorm(gameState, wormId).speed, 'changeSpeed');
    return Math.max(5, newSpeed);
}

function getWormTurningSpeed(gameState, wormId) {
    var worm = gameStateFunctions.getWorm(gameState, wormId);
    var speedUp = getWormSpeed(gameState, wormId) / worm.speed;
    var initValue = worm.turningSpeed * speedUp;
    return Math.min(5, transformValueUsingEffects(gameState, wormId, initValue, 'changeTurningSpeed'));
}

function getWormTurningVelocity(gameState, wormId, deltaTime) {
    var turningVelocity;
    var player = gameStateFunctions.getPlayer(gameState, gameStateFunctions.getWorm(gameState, wormId).playerId);
    var tronTurnEffects = gameStateFunctions.getWormEffects(gameState, wormId, 'tronTurn');
    if (tronTurnEffects.length > 0) {
        turningVelocity = constants.effectDefinitions['tronTurn'].getWormTurningVelocity(gameState, tronTurnEffects[0], deltaTime);
    } else {
        turningVelocity = player.steering * getWormTurningSpeed(gameState, wormId);
    }
    return transformValueUsingEffects(gameState, wormId, turningVelocity, 'changeTurningVelocity');
}

function isWormJumping(gameState, wormId) {
    return transformValueUsingEffects(gameState, wormId, gameStateFunctions.getWorm(gameState, wormId).jump.remainingJumpTime > 0, 'changeIsJumping');
}

function killPlayer(gameState, playerId) {
    var player = gameStateFunctions.getPlayer(gameState, playerId);
    player.alive = false;
    gameState.gameEvents.push({
        type: "player_died",
        time: gameState.gameTime,
        playerId: playerId
    });
}

function killWorm(gameState, wormId) {
    var worm = gameStateFunctions.getWorm(gameState, wormId);
    worm.alive = false;
    if (gameStateFunctions.getAliveWorms(gameState, worm.playerId).length === 0) {
        killPlayer(gameState, worm.playerId);
    }
}

/**
 * Transform the given initValue based on effects owned by wormId. Each effect owned by wormId that has the function effectFunctionName in its definition will be called and the value will be changed in a pipe-line fashion.
 * Available effectFunctionNames: "changeSpeed", "changeTurningSpeed", "changeSize"
 */
function transformValueUsingEffects(gameState, wormId, initValue, effectFunctionName) {
    /**
     * Returns all effects currently owned by wormId and that has the function effectFunctionName in its definition
     */
    function getEffectsWithFunction(gameState, wormId, effectFunctionName) {
        return gameStateFunctions.getWormEffects(gameState, wormId).filter(e => constants.effectDefinitions[e.type][effectFunctionName]);
    }

    return getEffectsWithFunction(gameState, wormId, effectFunctionName).reduce(function (accValue, effect) {
        var effectHandler = constants.effectDefinitions[effect.type];
        return effectHandler[effectFunctionName](gameState, effect, accValue);
    }, initValue);
}

function collisionDetection(gameState, worm) {
    function wormMapCollision(gameState, wormId) {
        var worm = gameStateFunctions.getWorm(gameState, wormId);
        return !shapeSpatialRelations.contains(gameState.map.shape, worm.head);
    }

    function wormWormCollision(gameState, worm) {
        function isImmuneCell(gameState, worm, cell) {
            var IMMUNITY_DISTANCE_MULTIPLIER = 5;
            var data = worm.immunityData;
            return data.distanceTravelled - data.cellsDistanceTravelled[cell] <= IMMUNITY_DISTANCE_MULTIPLIER * getWormSize(gameState, worm.id);
        }

        var playArea = gameState.playArea;
        var cells = shapeToGridConverter.convert(worm.head, playArea, ShapeToGridConverter.RoundingModes.CONTAINMENT);
        return cells.some(function (cell) {
            var value = playArea.grid[cell];
            if (value !== constants.PLAY_AREA_FREE) { // TODO Utility function to check if worm-id
                if (!isImmuneCell(gameState, worm, cell)) {
                    return true;
                }
            }
        });
    }

    function wormPowerUpCollision(gameState, worm) {
        var powerUps = gameState.powerUps;
        var collidedPowerUps = [];
        powerUps.forEach(function (powerUp) {
            if (shapeSpatialRelations.intersects(worm.head, powerUp.shape)) {
                collidedPowerUps.push(powerUp.id);
            }
        });
        return collidedPowerUps;
    }

    wormPowerUpCollision(gameState, worm).forEach(function (powerUpId) {
        activatePowerUp(gameState, powerUpId, worm.id);
    });
    if (worm.alive && wormMapCollision(gameState, worm.id)) {
        killWorm(gameState, worm.id);
    }
    if (worm.alive && !isWormJumping(gameState, worm.id)) {
        if (wormWormCollision(gameState, worm)) {
            killWorm(gameState, worm.id);
        }
    }
}

function updateWorms(gameState, deltaTime) {
    gameStateFunctions.forEachAliveWorm(gameState, function (worm) {
        function updateBody() {
            function setImmunityCells(worm, cells) {
                cells.forEach(function (cell) {
                    worm.immunityData.cellsDistanceTravelled[cell.index] = worm.immunityData.distanceTravelled;
                });
            }

            function pushBodyPart(gameState, worm) {
                var changedCells = gameStateFunctions.addPlayAreaWormHead(gameState, worm);
                setImmunityCells(worm, changedCells);
                gameStateFunctions.getAliveWorms(gameState, worm.playerId).forEach(function (w) {
                    //if()
                    //w => wormBodyImmunityHandler.setImmunityCells(w, changedCells));
                });
            }

            var bodyPart = clone(worm.head);
            pushBodyPart(gameState, worm, bodyPart);
            return bodyPart;
        }

        function updateImmunityData(worm) {
            var data = worm.immunityData;
            data.distanceTravelled += shapeSpatialRelations.distanceSquared(worm.head, data.prevPosition);
            data.prevPosition = worm.head;
        }

        collisionDetection(gameState, worm);
        var direction = getWormDirection(gameState, worm.id);
        var speed = getWormSpeed(gameState, worm.id);
        var size = getWormSize(gameState, worm.id);
        var turningVelocity = getWormTurningVelocity(gameState, worm.id, deltaTime);
        var jump = isWormJumping(gameState, worm.id);
        if (gameStateFunctions.isInStartPhase(gameState)) {
            speed = 0;
        }
        var pathSegment = trajectoryUtil.createTrajectory({
            duration: deltaTime,
            startX: worm.head.centerX,
            startY: worm.head.centerY,
            startDirection: direction,
            speed,
            turningVelocity
        });
        pathSegment.startTime = gameState.gameTime - deltaTime;
        pathSegment.endTime = gameState.gameTime;
        pathSegment.jump = jump;
        pathSegment.size = size;
        pathSegment.playerId = worm.playerId;

        worm.head.radius = size / 2;
        if (speed > 0 && !jump) {
            // No body update during the start phase and also only render the body if we are not standing still
            updateBody();
        }
        worm.direction += turningVelocity * deltaTime;
        worm.head = shapeFactory.createCircle(worm.head.radius, pathSegment.endX - worm.head.radius, pathSegment.endY - worm.head.radius);
        updateImmunityData(worm);
        gameStateFunctions.addWormPathSegment(gameState, worm.id, pathSegment);
    });
}


module.exports = {
    activatePowerUp,
    getShapeRandomlyInsidePlayableArea,
    getWormDirection,
    getWormSize,
    getWormSpeed,
    getWormTurningSpeed,
    getWormTurningVelocity,
    isWormJumping,
    killPlayer,
    killWorm,
    updateWorms
};
