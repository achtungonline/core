var CHANGE = 0.7;
var DURATION = 10;
var FAST_TURN_TYPE = "fastTurn";

var me = module.exports = {};

me.type = FAST_TURN_TYPE;

me.FastTurnEffectHandler = function FastTurnEffectHandler(deps) {
    var wormHandler = deps.wormHandler;

    function activate(gameState, worm) {
        wormHandler.changeTurningSpeed(worm, CHANGE);
        return {
            duration: DURATION,
            change: CHANGE,
            worm: worm,
            type: FAST_TURN_TYPE
        };
    }

    function deactivate(gameState, effect) {
        wormHandler.changeTurningSpeed(effect.worm, -effect.change);
    }

    return {
        activate: activate,
        deactivate: deactivate
    };
};
