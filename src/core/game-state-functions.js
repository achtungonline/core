var speedEffectDefinition = require("./power-up/effect-definitions/speed.js");
var sizeEffectDefinition = require("./power-up/effect-definitions/size.js");
var turningSpeedEffectDefinition = require("./power-up/effect-definitions/turning-speed.js");
var wormSwitchEffectDefinition = require("./power-up/effect-definitions/worm-switch.js");
var drunkEffectDefinition = require("./power-up/effect-definitions/drunk.js");
var clearEffectDefinition = require("./power-up/effect-definitions/clear.js");
var superJumpEffectDefinition = require("./power-up/effect-definitions/super-jump.js");

/**
 * A bunch of functions for reading and updating data on the gameState
 */

var effectDefinitions = {};
effectDefinitions[speedEffectDefinition.type] = speedEffectDefinition;
effectDefinitions[sizeEffectDefinition.type] = sizeEffectDefinition;
effectDefinitions[turningSpeedEffectDefinition.type] = turningSpeedEffectDefinition;
effectDefinitions[wormSwitchEffectDefinition.type] = wormSwitchEffectDefinition;
effectDefinitions[drunkEffectDefinition.type] = drunkEffectDefinition;
effectDefinitions[clearEffectDefinition.type] = clearEffectDefinition;
effectDefinitions[superJumpEffectDefinition.type] = superJumpEffectDefinition;

var powerUpDefinitions = {};
powerUpDefinitions["speed"] = {
    name: "Speed",
    effectType: speedEffectDefinition.type,
    effectDuration: 5,
    effectStrength: 3 / 2,
    affects: "self"
};
powerUpDefinitions["slow"] = {
    name: "Slow",
    effectType: speedEffectDefinition.type,
    effectDuration: 5,
    effectStrength: 2 / 3,
    affects: "others"
};
powerUpDefinitions["fat"] = {
    name: "Fat",
    effectType: sizeEffectDefinition.type,
    effectDuration: 5,
    effectStrength: 2,
    affects: "others"
};
powerUpDefinitions["slim"] = {
    name: "Slim",
    effectType: sizeEffectDefinition.type,
    effectDuration: 5,
    effectStrength: 0.5,
    affects: "self"
};
powerUpDefinitions["quickTurn"] = {
    name: "Quick Turn",
    effectType: turningSpeedEffectDefinition.type,
    effectDuration: 5,
    effectStrength: 2,
    affects: "self"
};
powerUpDefinitions["slowTurn"] = {
    name: "Slow Turn",
    effectType: turningSpeedEffectDefinition.type,
    effectDuration: 5,
    effectStrength: 0.5,
    affects: "others"
};
powerUpDefinitions["switcharoonie"] = {
    name: "Switcharoonie",
    effectType: wormSwitchEffectDefinition.type,
    affects: "all"
};
powerUpDefinitions["keyBindingsSwitch"] = {
    name: "Switch Keys",
    effectType: turningSpeedEffectDefinition.type,
    effectDuration: 5,
    effectStrength: -1,
    affects: "others"
};
powerUpDefinitions["drunk"] = {
    name: "Drunk",
    effectType: drunkEffectDefinition.type,
    effectDuration: 5,
    effectStrength: 1,
    affects: "others"
};
powerUpDefinitions["clear"] = {
    name: "Clear",
    effectType: clearEffectDefinition.type,
    affects: "all"
};
powerUpDefinitions["superJump"] = {
    name: "Super Jump",
    effectType: superJumpEffectDefinition.type,
    effectDuration: 5,
    effectStrength: -1,
    affects: "self"
};


function addEffect(gameState, effect) {
    gameState.effects.push(effect)
}

function getEffect(gameState, effectId) {
    return gameState.effects.find(e => e.id === effectId);
}

function getEnemyWorms(gamesState, wormId) {
    return gamesState.worms.filter(w => w.playerId !== getWorm(gamesState, wormId).playerId);
}

function getPowerUp(gameState, powerUpId) {
    return gameState.powerUps.find(p => p.id === powerUpId);
}

function getWorm(gameState, wormId) {
    return gameState.worms.find(w => w.id === wormId);
}

function getPlayer(gameState, playerId) {
    return gameState.players.find(p => p.id === playerId);
}

function getWormDirection(gameState, wormId) {
    return transformValueUsingEffects(gameState, wormId, getWorm(gameState, wormId).direction, 'changeDirection');
}

function getWormEffects(gameState, wormId) {
    return gameState.effects.filter(function (effect) {
        return effect.wormId === wormId;
    });
}
function getWormSize(gameState, wormId) {
    var newSize = transformValueUsingEffects(gameState, wormId, getWorm(gameState, wormId).size, 'changeSize');
    return (newSize < 1) ? 1 : newSize
}


function getWormSpeed(gameState, wormId) {
    var newSpeed = transformValueUsingEffects(gameState, wormId, getWorm(gameState, wormId).speed, 'changeSpeed');
    return (newSpeed < 1) ? 1 : newSpeed;
}

function getWormTurningSpeed(gameState, wormId) {
    var worm = getWorm(gameState, wormId);
    var speedUp = getWormSpeed(gameState, wormId) / worm.speed;
    var initValue = worm.turningSpeed * speedUp;
    return transformValueUsingEffects(gameState, wormId, initValue, 'changeTurningSpeed');
}

function isWormJumping(gameState, wormId) {
    return transformValueUsingEffects(gameState, wormId, getWorm(gameState, wormId).jump.remainingJumpTime > 0, 'changeIsJumping');
}

/**
 * Transform the given initValue based on effects owned by wormId. Each effect owned by wormId that has the function effectFunctionName in its definition will be called and the value will be changed in a pipe-line fashion.
 * Available effectFunctionNames: "changeSpeed", "changeTurningSpeed", "changeSize"
 */
function transformValueUsingEffects(gameState, wormId, initValue, effectFunctionName) {
    return getEffectsWithFunction(gameState, wormId, effectFunctionName).reduce(function (accValue, effect) {
        var effectHandler = effectDefinitions[effect.type];
        return effectHandler[effectFunctionName](gameState, effect, accValue);
    }, initValue);
}

/**
 * Returns all effects currently owned by wormId and that has the function effectFunctionName in its definition
 */
function getEffectsWithFunction(gameState, wormId, effectFunctionName) {
    return getWormEffects(gameState, wormId).filter(e => effectDefinitions[e.type][effectFunctionName]);
}

function getAlivePlayers(gameState) {
    return gameState.players.filter(p => p.alive);
}

function isPlayerAlive(gameState, playerId) {
    return !!getAlivePlayers(gameState).find(p => p.id === playerId);
}

module.exports = {
    addEffect: addEffect,
    getEffect: getEffect,
    getEffectDefinitions: effectDefinitions,
    getPowerUpDefinitions: powerUpDefinitions,
    getEnemyWorms: getEnemyWorms,
    getPowerUp: getPowerUp,
    getPlayer: getPlayer,
    getWorm: getWorm,
    getWormDirection: getWormDirection,
    getWormSize: getWormSize,
    getWormSpeed: getWormSpeed,
    getWormTurningSpeed: getWormTurningSpeed,
    getWormEffects: getWormEffects,
    isWormJumping: isWormJumping,
    getAlivePlayers: getAlivePlayers,
    isPlayerAlive: isPlayerAlive
};