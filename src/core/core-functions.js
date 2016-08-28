var gameStateFunctions = require("./game-state-functions.js");
var shapeSpatialRelations = require("./geometry/shape-spatial-relations.js");
var shapeModifierI = require("./geometry/shape-modifier-immutable.js");
var random = require("./util/random.js");
var clone = require("./util/clone.js");

var speedEffectDefinition = require("./power-up/effect-definitions/speed.js");
var sizeEffectDefinition = require("./power-up/effect-definitions/size.js");
var turningSpeedEffectDefinition = require("./power-up/effect-definitions/turning-speed.js");
var wormSwitchEffectDefinition = require("./power-up/effect-definitions/worm-switch.js");
var drunkEffectDefinition = require("./power-up/effect-definitions/drunk.js");
var clearEffectDefinition = require("./power-up/effect-definitions/clear.js");
var superJumpEffectDefinition = require("./power-up/effect-definitions/super-jump.js");
var tronTurnEffectDefinition = require("./power-up/effect-definitions/tron-turn.js");

/**
 * The core functionality of the game
 */

var effectDefinitions = {};
effectDefinitions[speedEffectDefinition.type] = speedEffectDefinition;
effectDefinitions[sizeEffectDefinition.type] = sizeEffectDefinition;
effectDefinitions[turningSpeedEffectDefinition.type] = turningSpeedEffectDefinition;
effectDefinitions[wormSwitchEffectDefinition.type] = wormSwitchEffectDefinition;
effectDefinitions[drunkEffectDefinition.type] = drunkEffectDefinition;
effectDefinitions[clearEffectDefinition.type] = clearEffectDefinition;
effectDefinitions[superJumpEffectDefinition.type] = superJumpEffectDefinition;
effectDefinitions[tronTurnEffectDefinition.type] = tronTurnEffectDefinition;


var powerUpDefinitions = {};
powerUpDefinitions["speed"] = {
    name: "speed",
    effectType: speedEffectDefinition.type,
    effectDuration: 5,
    effectStrength: 3 / 2,
    weightedSpawnChance: 1,
    affects: "self"
};
powerUpDefinitions["slow"] = {
    name: "slow",
    effectType: speedEffectDefinition.type,
    effectDuration: 5,
    effectStrength: 2 / 3,
    weightedSpawnChance: 1,
    affects: "others"
};
powerUpDefinitions["fat"] = {
    name: "fat",
    effectType: sizeEffectDefinition.type,
    effectDuration: 5,
    effectStrength: 2,
    weightedSpawnChance: 1,
    affects: "others"
};
powerUpDefinitions["slim"] = {
    name: "slim",
    effectType: sizeEffectDefinition.type,
    effectDuration: 5,
    effectStrength: 0.5,
    weightedSpawnChance: 1,
    affects: "self"
};
powerUpDefinitions["quick_turn"] = {
    name: "quick_turn",
    effectType: turningSpeedEffectDefinition.type,
    effectDuration: 5,
    effectStrength: 3 / 2,
    weightedSpawnChance: 1,
    affects: "self"
};
powerUpDefinitions["slow_turn"] = {
    name: "slow_turn",
    effectType: turningSpeedEffectDefinition.type,
    effectDuration: 5,
    effectStrength: 2 / 3,
    weightedSpawnChance: 1,
    affects: "others"
};
powerUpDefinitions["switcharoonie"] = {
    name: "switcharoonie",
    effectType: wormSwitchEffectDefinition.type,
    weightedSpawnChance: 0.5,
    affects: "all"
};
powerUpDefinitions["key_switch"] = {
    name: "key_switch",
    effectType: turningSpeedEffectDefinition.type,
    effectDuration: 5,
    effectStrength: -1,
    weightedSpawnChance: 1,
    affects: "others"
};
powerUpDefinitions["drunk"] = {
    name: "drunk",
    effectType: drunkEffectDefinition.type,
    effectDuration: 5,
    effectStrength: 1,
    weightedSpawnChance: 1,
    affects: "others"
};
powerUpDefinitions["clear_all"] = {
    name: "clear",
    effectType: clearEffectDefinition.type,
    weightedSpawnChance: 0.25,
    affects: "all"
};
powerUpDefinitions["clear_self"] = {
    name: "clear",
    effectType: clearEffectDefinition.type,
    weightedSpawnChance: 0.25,
    affects: "self"
};
powerUpDefinitions["clear_others"] = {
    name: "clear",
    effectType: clearEffectDefinition.type,
    weightedSpawnChance: 0.25,
    affects: "others"
};
powerUpDefinitions["super_jump"] = {
    name: "super_jump",
    effectType: superJumpEffectDefinition.type,
    effectDuration: 5,
    weightedSpawnChance: 1,
    affects: "self"
};
powerUpDefinitions["tron_turn"] = {
    name: "tron_turn",
    effectType: tronTurnEffectDefinition.type,
    effectDuration: 5,
    weightedSpawnChance: 1,
    affects: "others"
};

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
            gameStateFunctions.getEnemyWorms(gameState, wormId).forEach(function (worm) {
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


module.exports = {
    activatePowerUp,
    effectDefinitions,
    powerUpDefinitions,
    getShapeRandomlyInsidePlayableArea,
    getWormDirection,
    getWormSize,
    getWormSpeed,
    getWormTurningSpeed,
    getWormTurningVelocity,
    isWormJumping,
    killPlayer,
    killWorm
};
