var constants = require("./constants.js");
var gameStateFunctions = require("./game-state-functions.js");
var shapeSpatialRelations = require("./geometry/shape-spatial-relations.js");
var shapeModifierI = require("./geometry/shape-modifier-immutable.js");
var random = require("./util/random.js");
var clone = require("./util/clone.js");
var trajectoryUtil = require("./geometry/trajectory/trajectory-util.js");
var ShapeToGridConverter = require("./geometry/shape-to-grid-converter.js");
var shapeToGridConverter = ShapeToGridConverter.createShapeToGridConverter();

var speedEffectDefinition = require("./power-up/effect-definitions/speed.js");
var sizeEffectDefinition = require("./power-up/effect-definitions/size.js");
var turningSpeedEffectDefinition = require("./power-up/effect-definitions/turning-speed.js");
var wormSwitchEffectDefinition = require("./power-up/effect-definitions/worm-switch.js");
var drunkEffectDefinition = require("./power-up/effect-definitions/drunk.js");
var clearEffectDefinition = require("./power-up/effect-definitions/clear.js");
var superJumpEffectDefinition = require("./power-up/effect-definitions/super-jump.js");
var tronTurnEffectDefinition = require("./power-up/effect-definitions/tron-turn.js");
var twinEffectDefinition = require("./power-up/effect-definitions/twin.js");

var effectDefinitions = {};
effectDefinitions[speedEffectDefinition.type] = speedEffectDefinition;
effectDefinitions[sizeEffectDefinition.type] = sizeEffectDefinition;
effectDefinitions[turningSpeedEffectDefinition.type] = turningSpeedEffectDefinition;
effectDefinitions[wormSwitchEffectDefinition.type] = wormSwitchEffectDefinition;
effectDefinitions[drunkEffectDefinition.type] = drunkEffectDefinition;
effectDefinitions[clearEffectDefinition.type] = clearEffectDefinition;
effectDefinitions[superJumpEffectDefinition.type] = superJumpEffectDefinition;
effectDefinitions[tronTurnEffectDefinition.type] = tronTurnEffectDefinition;
effectDefinitions[twinEffectDefinition.type] = twinEffectDefinition;

function activatePowerUp(gameState, powerUpId, wormId) {
    var index = gameState.powerUps.findIndex(powerUp => powerUp.id === powerUpId);
    var powerUp = gameState.powerUps[index];
    var effect = effectDefinitions[powerUp.effectType].activate({
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

function getRandomPositionInsidePlayableArea(gameState, minDistance) {
    var map = gameState.map;

    function intersectsBlockingShapes(shape) {
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
    while (i < 100000) {
        pos.x = random.random(gameState) * map.width;
        pos.y = random.random(gameState) * map.height;
        var shape = {centerX: pos.x, centerY: pos.y, radius: minDistance};
        if (shapeSpatialRelations.contains(shrunkenMapShape, shape) && !intersectsBlockingShapes(shape)) {
            return pos;
        }
        i++;
    }
    throw Error("Failed to find a position inside playable area for the given shape");
}

function getWormDirection(gameState, wormId) {
    return transformValueUsingEffects(gameState, wormId, gameStateFunctions.getWorm(gameState, wormId).direction, 'changeDirection');
}

function getWormRadius(gameState, wormId) {
    var newSize = transformValueUsingEffects(gameState, wormId, gameStateFunctions.getWorm(gameState, wormId).radius, 'changeSize');
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
        turningVelocity = effectDefinitions['tronTurn'].getWormTurningVelocity(gameState, tronTurnEffects[0], deltaTime);
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
        return gameStateFunctions.getWormEffects(gameState, wormId).filter(e => effectDefinitions[e.type][effectFunctionName]);
    }

    return getEffectsWithFunction(gameState, wormId, effectFunctionName).reduce(function (accValue, effect) {
        var effectHandler = effectDefinitions[effect.type];
        return effectHandler[effectFunctionName](gameState, effect, accValue);
    }, initValue);
}

function collisionDetection(gameState, worm) {
    function wormMapCollision(gameState, wormId) {
        var worm = gameStateFunctions.getWorm(gameState, wormId);
        return !shapeSpatialRelations.contains(gameState.map.shape, worm);
    }

    function wormWormCollision(gameState, worm) {
        function isImmuneCell(gameState, worm, cell) {
            var IMMUNITY_DISTANCE_MULTIPLIER = 5;
            var data = worm.immunityData;
            return data.distanceTravelled - data.cellsDistanceTravelled[cell] <= IMMUNITY_DISTANCE_MULTIPLIER * getWormRadius(gameState, worm.id);
        }

        var playArea = gameState.playArea;
        var cells = shapeToGridConverter.convert(worm, playArea, ShapeToGridConverter.RoundingModes.CONTAINMENT);
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
            if (shapeSpatialRelations.intersects(worm, powerUp.shape)) {
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
            }

            pushBodyPart(gameState, worm);
        }

        function updateImmunityData(worm) {
            var data = worm.immunityData;
            data.distanceTravelled += shapeSpatialRelations.distanceSquared(worm, data.prevPosition);
            data.prevPosition = {
                centerX: worm.centerX,
                centerY: worm.centerY,
                radius: worm.radius
            };
        }

        collisionDetection(gameState, worm);
        var direction = getWormDirection(gameState, worm.id);
        var speed = getWormSpeed(gameState, worm.id);
        var radius = getWormRadius(gameState, worm.id);
        var turningVelocity = getWormTurningVelocity(gameState, worm.id, deltaTime);
        var jump = isWormJumping(gameState, worm.id);
        if (gameStateFunctions.isInStartPhase(gameState)) {
            speed = 0;
        }
        var pathSegment = trajectoryUtil.createTrajectory({
            duration: deltaTime,
            startX: worm.centerX,
            startY: worm.centerY,
            startDirection: direction,
            speed,
            turningVelocity
        });
        pathSegment.startTime = gameState.gameTime - deltaTime;
        pathSegment.endTime = gameState.gameTime;
        pathSegment.jump = jump;
        pathSegment.size = radius;
        pathSegment.playerId = worm.playerId;

        if (speed > 0 && !jump) {
            // No body update during the start phase and also only render the body if we are not standing still
            updateBody();
        }
        worm.direction += turningVelocity * deltaTime;
        worm.centerX = pathSegment.endX;
        worm.centerY = pathSegment.endY;
        updateImmunityData(worm);
        gameStateFunctions.addWormPathSegment(gameState, worm.id, pathSegment);
    });
}

function updateEffects(gameState, deltaTime) {
    var effects = gameState.effects;
    for (var i = effects.length - 1; i >= 0; i--) {
        var effect = effects[i];
        effect.timeLeft -= deltaTime;
        var effectDefinition = effectDefinitions[effect.type];
        if (effectDefinition.update) {
            effectDefinition.update(gameState, deltaTime, effect)
        }
        if (effect.timeLeft <= 0) {
            gameStateFunctions.removeEffect(gameState, effect.id);
        }
    }
}

module.exports = {
    activatePowerUp,
    getRandomPositionInsidePlayableArea,
    getWormDirection,
    getWormRadius,
    getWormSpeed,
    getWormTurningSpeed,
    getWormTurningVelocity,
    isWormJumping,
    killPlayer,
    killWorm,
    updateWorms,
    updateEffects
};
