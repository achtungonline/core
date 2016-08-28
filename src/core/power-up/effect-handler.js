var coreFunctions = require("../core-functions.js");
var gameStateFunctions = require("../game-state-functions.js");

module.exports = function EffectHandler() {
    function update(deltaTime, gameState) {
        var effects = gameState.effects;
        for (var i = effects.length - 1; i >= 0; i--) {
            var effect = effects[i];
            effect.timeLeft -= deltaTime;
            var effectDefinition = coreFunctions.effectDefinitions[effect.type];
            if (effectDefinition.update) {
                effectDefinition.update(gameState, deltaTime, effect)
            }
            if (effect.timeLeft <= 0) {
                gameStateFunctions.removeEffect(gameState, effect.id);
            }
        }
    }

    return {
        update: update
    };
};
