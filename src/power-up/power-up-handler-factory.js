var PowerUpHandler = require("./power-up-handler.js");
var speedEffect = require("./speed-effect-handler.js");
var timeBasedChance = require("./../time-based-chance.js");
var shapeSpatialRelations = require("./../geometry/shape-spatial-relations.js");
var mapUtils = require("./../map/map-utils.js");
var idGenerator = require("./../util/id-generator.js").indexCounterId(0);

module.exports = function PowerUpHandlerFactory(deps) {
    function create() {
        var effectsFunctionMap = {};
        effectsFunctionMap[speedEffect.type] = speedEffect.SpeedEffectHandler({wormHandler: deps.wormHandler, effectHandler: deps.effectHandler});

        var timeBasedChanceTrigger = timeBasedChance.TimeBasedChanceTrigger(timeBasedChance.calculators.ExpoTimeBasedChanceCalculator(0.3), deps.random);

        var dependencies = {
            effectsFunctionMap: effectsFunctionMap,
            collisionHandler: deps.collisionHandler,
            timeBasedChanceTrigger: timeBasedChanceTrigger,
            shapeSpatialRelations: shapeSpatialRelations,
            idGenerator: idGenerator,
            mapUtils: mapUtils,
            random: deps.random
        };

        return PowerUpHandler(dependencies);
    }

    return {
        create: create
    };
};