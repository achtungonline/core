var EffectHandler = require("./effect-handler.js");
var speedEffect = require("./speed-effect-handler.js");

module.exports = function EffectHandlerFactory(deps) {
    function create() {
        var effectsFunctionMap = {};
        effectsFunctionMap[speedEffect.type] = speedEffect.SpeedEffectHandler({wormHandler: deps.wormHandler});

        var dependencies = {
            effectsFunctionMap: effectsFunctionMap
        };

        return EffectHandler(dependencies);
    }

    return {
        create: create
    };
};