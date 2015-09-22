var EventEmitter = require("events").EventEmitter;
var forEach = require("../util/for-each.js");

module.exports = function EffectHandler(deps) {

    var effectTypes = [];
    forEach(deps.effectsFunctionMap, function (effect, type) {
        effectTypes.push(type);
    });

    function update(deltaTime, gameState) {
        var effects = gameState.effects;
        for (var i = effects.length - 1; i >= 0; i--) {
            var effect = effects[i];
            effect.duration -= deltaTime;
            if (effect.duration <= 0) {
                effects.splice(i, 1);
                deps.effectsFunctionMap[effect.type].deactivate(gameState, effect);
            }
        }
    }

    function activateEffect(gameState, worm, effectType) {
        deps.effectsFunctionMap[effectType].activate(gameState, worm);
    }

    function getEffectTypes() {
        return effectTypes;
    }

    return {
        update: update,
        activateEffect: activateEffect,
        getEffectTypes: getEffectTypes
    };
};