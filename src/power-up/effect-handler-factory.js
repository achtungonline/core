var EffectHandler = require("./effect-handler.js");
var speedEffect = require("./effect-handlers/speed-effect-handler.js");
var fatEffect = require("./effect-handlers/fat-effect-handler.js");
var wormSwitchEffect = require("./effect-handlers/worm-switch-handler.js");

module.exports = function EffectHandlerFactory(deps) {
    function create() {
        var effectsFunctionMap = {};
        effectsFunctionMap[speedEffect.type] = speedEffect.SpeedEffectHandler({wormHandler: deps.wormHandler});
        effectsFunctionMap[fatEffect.type] = fatEffect.FatEffectHandler({wormHandler: deps.wormHandler});
        effectsFunctionMap[wormSwitchEffect.type] = wormSwitchEffect.WormSwitchEffectHandler({random: deps.random});

        var dependencies = {
            effectsFunctionMap: effectsFunctionMap
        };

        return EffectHandler(dependencies);
    }

    return {
        create: create
    };
};