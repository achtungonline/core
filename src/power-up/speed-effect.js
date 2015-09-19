var CHANGE = 25;
var DURATION = 3;
var SPEED_TYPE = "speed";

var me = module.exports = {};

me.type = SPEED_TYPE;

me.SpeedEffect = function SpeedEffect(effectHandler, wormHandler) {

    //effectHandler.on(effectHandler.events.EFFECT_ENDED, function(gameState, effect) {
    //    if(effect.type === SPEED_TYPE) {
    //        var worm = effect.worm;
    //        deactivate(worm);
    //    }
    //});

    function activate(gameState, worm) {
        //wormHandler.changeSpeed(worm, CHANGE);
        //return {
        //    duration: DURATION,
        //    change: CHANGE,
        //    worm: worm,
        //    type: SPEED_TYPE
        //};
    }

    function deactivate(gameState, worm) {
        wormHandler.changeSpeed(worm, -CHANGE);
    }

    return {
        activate: activate
    };
};