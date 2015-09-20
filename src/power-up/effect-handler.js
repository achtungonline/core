var EventEmitter = require("events").EventEmitter;

module.exports = function EffectHandler() {
    var eventEmitter = new EventEmitter();
    var events = {};
    events.EFFECT_ENDED = "effectEnded";

    function update(deltaTime, gameState) {
        var effects = gameState.effects;
        for (var i = effects.length - 1; i >= 0; i--) {
            var effect = effects[i];
            effect.duration -= deltaTime;
            if (effect.duration <= 0) {
                effects.splice(i, 1);
                eventEmitter.emit(events.EFFECT_ENDED, gameState, effect);
            }
        }
    }

    function addEffect(gameState, effect) {
        gameState.effects.push(effect);
    }

    return {
        update: update,
        addEffect: addEffect,
        on: eventEmitter.on.bind(eventEmitter),
        events: events
    };
};