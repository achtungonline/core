var gameStateFunctions = require("../game-state-functions.js");

module.exports = function EffectHandler(options) {

    function update(deltaTime, gameState) {
        var effects = gameState.effects;
        for (var i = effects.length - 1; i >= 0; i--) {
            var effect = effects[i];
            effect.duration -= deltaTime;
            if (effect.duration <= 0) {
                effects.splice(i, 1);
            }
        }
    }

    function activateEffect(gameState, wormId, powerUpId) {
        var powerUp = gameStateFunctions.getPowerUp(gameState, powerUpId);
        var effect = gameStateFunctions.getEffectDefinitions[powerUp.effectType].activate(gameState, powerUp.effectStrength, powerUp.effectDuration, wormId);
        if (effect) {
            gameStateFunctions.addEffect(gameState, effect);
        }
    }

    return {
        update: update,
        activateEffect: activateEffect // Can not permenent changes, such as worm-switch-effect
    };
};