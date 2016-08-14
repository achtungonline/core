var gameStateFunctions = require("../game-state-functions.js");
var coreFunctions = require("../core-functions.js");
var clone = require("../util/clone.js");

module.exports = function EffectHandler() {
    function update(deltaTime, gameState) {
        var effects = gameState.effects;
        for (var i = effects.length - 1; i >= 0; i--) {
            var effect = effects[i];
            effect.timeLeft -= deltaTime;
            var effectDefinition = coreFunctions.getEffectDefinitions[effect.type];
            if (effectDefinition.update) {
                effectDefinition.update(gameState, deltaTime, effect)
            }
            if (effect.timeLeft <= 0) {
                effects.splice(i, 1);
            }
        }
    }

    function activateEffect(gameState, wormId, powerUpId) {

        var powerUp = gameStateFunctions.getPowerUp(gameState, powerUpId);
        var effect = coreFunctions.getEffectDefinitions[powerUp.effectType].activate(gameState, powerUp.effectStrength, powerUp.effectDuration, wormId, powerUp.affects);
        if (effect) {
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
    }

    return {
        update: update,
        activateEffect: activateEffect // Can not permenent changes, such as worm-switch-effect
    };
};
