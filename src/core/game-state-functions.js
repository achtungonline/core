var ShapeModifierIFactory = require("./geometry/shape-modifier-immutable-factory.js");
var shapeModifierIFactory = ShapeModifierIFactory();
var shapeModifierI = shapeModifierIFactory.create(); //TODO: Fix this (ML)


var speedEffectDefinition = require("./power-up/effect-definitions/speed.js");
var sizeEffectDefinition = require("./power-up/effect-definitions/size.js");

/**
 * A bunch of functions for reading and updating data on the gameState
 */


var effectDefinitions = {};
effectDefinitions["speed"] = speedEffectDefinition;
effectDefinitions["size"] = sizeEffectDefinition;

var powerUpDefinitions = {};
powerUpDefinitions["speed"] = {
    name: "Speed",
    effectType: "speed",
    effectDuration: 5,
    effectStrength: 3 / 2,
    affects: "self"
};
powerUpDefinitions["slow"] = {
    name: "Slow",
    effectType: "speed",
    effectDuration: 5,
    effectStrength: 2 / 3,
    affects: "others"
};
powerUpDefinitions["fat"] = {
    name: "Fat",
    effectType: "size",
    effectDuration: 5,
    effectStrength: 2,
    affects: "self"
};
powerUpDefinitions["slim"] = {
    name: "Slim",
    effectType: "size",
    effectDuration: 5,
    effectStrength: 0.5,
    affects: "others"
};

function addEffect(gameState, effect) {
    gameState.effects.push(effect)
}

function getEffect(gameState, effectId) {
    return gameState.effects.find(e => e.id === effectId);
}

function getPowerUp(gameState, powerUpId) {
    return gameState.powerUps.find(p => p.id === powerUpId);
}

function getWorm(gameState, wormId) {
    return gameState.worms.find(w => w.id === wormId);
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
    return (newSpeed < 0) ? 0 : newSpeed;
}

/**
 * Transform the given initValue based on effects owned by wormId. Each effect owned by wormId that has the function effectFunctionName in its definition will be called and the value will be changed in a pipe-line fashion.
 * Available effectFunctionNames: "changeSpeed"
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

module.exports = {
    addEffect: addEffect,
    getEffect: getEffect,
    getEffectDefinitions: effectDefinitions,
    getPowerUpDefinitions: powerUpDefinitions,
    getPowerUp: getPowerUp,
    getWorm: getWorm,
    getWormSize: getWormSize,
    getWormSpeed: getWormSpeed,
    getWormEffects: getWormEffects
};