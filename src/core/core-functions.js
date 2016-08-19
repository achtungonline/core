var gameStateFunctions = require("./game-state-functions.js");
var shapeSpatialRelations = require("./geometry/shape-spatial-relations.js");
var shapeModifierI = require("./geometry/shape-modifier-immutable.js");
var random = require("./util/random.js");

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
    name: "Speed",
    effectType: speedEffectDefinition.type,
    effectDuration: 5,
    effectStrength: 3 / 2,
    weightedSpawnChance: 1,
    affects: "self"
};
powerUpDefinitions["slow"] = {
    name: "Slow",
    effectType: speedEffectDefinition.type,
    effectDuration: 5,
    effectStrength: 2 / 3,
    weightedSpawnChance: 1,
    affects: "others"
};
powerUpDefinitions["fat"] = {
    name: "Fat",
    effectType: sizeEffectDefinition.type,
    effectDuration: 5,
    effectStrength: 2,
    weightedSpawnChance: 1,
    affects: "others"
};
powerUpDefinitions["slim"] = {
    name: "Slim",
    effectType: sizeEffectDefinition.type,
    effectDuration: 5,
    effectStrength: 0.5,
    weightedSpawnChance: 1,
    affects: "self"
};
powerUpDefinitions["quickTurn"] = {
    name: "Quick Turn",
    effectType: turningSpeedEffectDefinition.type,
    effectDuration: 5,
    effectStrength: 3 / 2,
    weightedSpawnChance: 1,
    affects: "self"
};
powerUpDefinitions["slowTurn"] = {
    name: "Slow Turn",
    effectType: turningSpeedEffectDefinition.type,
    effectDuration: 5,
    effectStrength: 2 / 3,
    weightedSpawnChance: 1,
    affects: "others"
};
powerUpDefinitions["switcharoonie"] = {
    name: "Switcharoonie",
    effectType: wormSwitchEffectDefinition.type,
    weightedSpawnChance: 0.5,
    affects: "all"
};
powerUpDefinitions["keyBindingsSwitch"] = {
    name: "Switch Keys",
    effectType: turningSpeedEffectDefinition.type,
    effectDuration: 5,
    effectStrength: -1,
    weightedSpawnChance: 1,
    affects: "others"
};
powerUpDefinitions["drunk"] = {
    name: "Drunk",
    effectType: drunkEffectDefinition.type,
    effectDuration: 5,
    effectStrength: 1,
    weightedSpawnChance: 1,
    affects: "others"
};
powerUpDefinitions["clear_all"] = {
    name: "Clear",
    effectType: clearEffectDefinition.type,
    weightedSpawnChance: 0.25,
    affects: "all"
};
powerUpDefinitions["clear_self"] = {
    name: "Clear",
    effectType: clearEffectDefinition.type,
    weightedSpawnChance: 0.25,
    affects: "self"
};
powerUpDefinitions["clear_others"] = {
    name: "Clear",
    effectType: clearEffectDefinition.type,
    weightedSpawnChance: 0.25,
    affects: "others"
};
powerUpDefinitions["superJump"] = {
    name: "Super Jump",
    effectType: superJumpEffectDefinition.type,
    effectDuration: 5,
    weightedSpawnChance: 1,
    affects: "self"
};
powerUpDefinitions["tronTurn"] = {
    name: "Tron Turn",
    effectType: tronTurnEffectDefinition.type,
    effectDuration: 5,
    weightedSpawnChance: 1,
    affects: "others"
};

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
    getEffectDefinitions: effectDefinitions,
    getPowerUpDefinitions: powerUpDefinitions,
    getShapeRandomlyInsidePlayableArea,
    getWormDirection,
    getWormSize,
    getWormSpeed,
    getWormTurningSpeed,
    getWormTurningVelocity,
    isWormJumping
};
