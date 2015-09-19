var PowerUpHandler = require("./power-up-handler.js");
var speedEffect = require("./speed-effect.js");
var timeBasedChance = require("./../time-based-chance.js");
var shapeSpatialRelations = require("./../geometry/shape-spatial-relations.js");
var mapUtils = require("./../map/map-utils.js");
var idGenerator = require("./../util/id-generator.js").indexCounterId(0);

module.exports = function PowerUpHandlerFactory(collisionHandler, random) {
    function create() {
        var powerUpFunctionMap = {};
        powerUpFunctionMap[speedEffect.type] = speedEffect.SpeedEffect;

        var timeBasedChanceTrigger = timeBasedChance.TimeBasedChanceTrigger(timeBasedChance.calculators.ExpoTimeBasedChanceCalculator(0.3), random);

        return PowerUpHandler(powerUpFunctionMap, collisionHandler, timeBasedChanceTrigger, shapeSpatialRelations, idGenerator, mapUtils, random);
    }

    return {
        create: create
    };
};