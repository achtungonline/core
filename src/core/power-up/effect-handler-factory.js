var EffectHandler = require("./effect-handler.js");
var speedEffect = require("./effect-handlers/speed-effect-handler.js");
var fatEffect = require("./effect-handlers/fat-effect-handler.js");
var wormSwitchEffect = require("./effect-handlers/worm-switch-effect-handler.js");
var fastTurnSpeedEffect = require("./effect-handlers/fast-turn-speed-effect-handler.js");

module.exports = function EffectHandlerFactory(deps) {
    function create() {
        var effectHandlersMap = {};
        effectHandlersMap[speedEffect.type] = speedEffect.SpeedEffectHandler();
        //effectHandlersMap[fatEffect.type] = fatEffect.FatEffectHandler();
        //effectHandlersMap[wormSwitchEffect.type] = wormSwitchEffect.WormSwitchEffectHandler({random: deps.random});
        //effectHandlersMap[fastTurnSpeedEffect.type] = fastTurnSpeedEffect.FastTurnEffectHandler();

        var dependencies = {
            effectHandlersMap: effectHandlersMap
        };

        return EffectHandler(dependencies);
    }

    return {
        create: create
    };
};