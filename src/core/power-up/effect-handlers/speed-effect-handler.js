var STRENGTH = 25;
var DURATION = 5;
var SPEED_TYPE = "speed";

var me = module.exports = {};

me.type = SPEED_TYPE;

me.SpeedEffectHandler = function SpeedEffectHandler(deps) {

    function transformSpeed(gameState, effect, wormSpeed) {
        return wormSpeed - effect.strength;
    }

    function activate(gameState, wormId) {
        return {
            duration: DURATION,
            strength: STRENGTH,
            wormId: wormId,
            type: SPEED_TYPE,
            transformSpeed: true
        };
    }

    return {
        activate,
        deactivate: function () {
        },
        transformSpeed
    };
};