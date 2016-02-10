var forEach = require("../util/for-each.js");

module.exports = function EffectHandler(options) {
    var effectHandlersMap = options.effectHandlersMap;

    var effectTypes = [];
    forEach(effectHandlersMap, function (effect, type) {
        effectTypes.push(type);
    });

    function update(deltaTime, gameState) {
        var effects = gameState.effects;
        for (var i = effects.length - 1; i >= 0; i--) {
            var effect = effects[i];
            effect.duration -= deltaTime;
            if (effect.duration <= 0) {
                effects.splice(i, 1);
                effectHandlersMap[effect.type].deactivate(gameState, effect);
            }
        }
    }

    function activateEffect(gameState, worm, effectType) {
        var effect = effectHandlersMap[effectType].activate(gameState, worm.id);
        if (effect) {
            gameState.effects.push(effect);
        }
    }

    function getEffectTypes() {
        return effectTypes;
    }

    //TODO We might want to move these to a file called game-state-handler or game-state-helper or similar
    function effectTransform(gameState, wormId, effectFunctionName, initValue) {
        return getEffects(gameState, wormId).reduce(function (value, effect) {
            var effectHandler = effectHandlersMap[effect.type];
            if (effectHandler[effectFunctionName]) {
                return effectHandler[effectFunctionName](gameState, effect, value);
            }
            return value;
        }, initValue);
    }

    function getEffects(gameState, wormId) {
        return gameState.effects.filter(function (effect) {
            return effect.wormId === wormId;
        });
    }

    return {
        update: update,
        activateEffect: activateEffect, // Can not permenent changes, such as worm-switch-effect
        getEffectTypes: getEffectTypes,
        effectTransform: effectTransform
    };
};