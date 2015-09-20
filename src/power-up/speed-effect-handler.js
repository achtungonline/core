var CHANGE = 25;
var DURATION = 3;
var SPEED_TYPE = "speed";

var me = module.exports = {};

me.type = SPEED_TYPE;

me.SpeedEffectHandler = function SpeedEffectHandler(deps) {

    deps.effectHandler.on(deps.effectHandler.events.EFFECT_ENDED, function (gameState, effect) {
        if (effect.type === SPEED_TYPE) {
            var worm = effect.worm;
            deactivate(worm, effect);
        }
    });

    function activate(gameState, worm) {
        deps.wormHandler.changeSpeed(worm, CHANGE);
        var effect = {
            duration: DURATION,
            change: CHANGE,
            worm: worm,
            type: SPEED_TYPE
        };
        deps.effectHandler.addEffect(gameState, effect);
    }

    function deactivate(worm, effect) {
        deps.wormHandler.changeSpeed(worm, -effect.change);
    }

    return {
        activate: activate
    };
};