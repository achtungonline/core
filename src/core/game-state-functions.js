/**
 * A bunch of functions for reading and updating data on the gameState
 */

var speedEffectDefinition = require("./power-up/effect-definitions/speed-effect.js");

var effectDefinitions = {};
effectDefinitions[speedEffectDefinition.type] = speedEffectDefinition;
//effectHandlersMap[fatEffect.type] = fatEffect.FatEffectHandler();
//effectHandlersMap[wormSwitchEffect.type] = wormSwitchEffect.WormSwitchEffectHandler({random: deps.random});
//effectHandlersMap[fastTurnSpeedEffect.type] = fastTurnSpeedEffect.FastTurnEffectHandler();

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

function getWormSpeed(gameState, wormId) {
    return transformValueUsingEffects(gameState, wormId, getWorm(gameState, wormId).speed, 'changeSpeed');
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
    getPowerUp: getPowerUp,
    getWorm: getWorm,
    getWormSpeed: getWormSpeed,
    getWormEffects: getWormEffects
};