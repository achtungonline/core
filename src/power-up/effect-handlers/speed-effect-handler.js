var CHANGE = 25;
var DURATION = 3;
var SPEED_TYPE = "speed";

var me = module.exports = {};

me.type = SPEED_TYPE;

me.SpeedEffectHandler = function SpeedEffectHandler(deps) {

    function activate(gameState, worm) {
        deps.wormHandler.changeSpeed(worm, CHANGE);
        var effect = {
            duration: DURATION,
            change: CHANGE,
            worm: worm,
            type: SPEED_TYPE
        };
        gameState.effects.push(effect);
    }

    function deactivate(gameState, effect) {
        deps.wormHandler.changeSpeed(effect.worm, -effect.change);
    }

    return {
        activate: activate,
        deactivate: deactivate
    };
};