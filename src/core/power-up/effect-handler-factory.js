var EffectHandler = require("./effect-handler.js");

module.exports = function EffectHandlerFactory(deps) {
    function create() {
        return EffectHandler();
    }
    return {
        create: create
    };
};