var PowerUpHandler = require("./power-up-handler.js");
var timeBasedChance = require("./../time-based-chance.js");
var shapeSpatialRelations = require("./../geometry/shape-spatial-relations.js");
var mapUtils = require("./../map/map-utils.js");
var idGenerator = require("./../util/id-generator.js").indexCounterId(0);

module.exports = function PowerUpHandlerFactory(deps) {
    function create() {
        var timeBasedChanceTrigger = timeBasedChance.TimeBasedChanceTrigger(timeBasedChance.calculators.ExpoTimeBasedChanceCalculator(0.15));

        var dependencies = {
            effectHandler: deps.effectHandler,
            collisionHandler: deps.collisionHandler,
            timeBasedChanceTrigger: timeBasedChanceTrigger,
            shapeSpatialRelations: shapeSpatialRelations,
            idGenerator: idGenerator,
            mapUtils: mapUtils
        };

        return PowerUpHandler(dependencies);
    }

    return {
        create: create
    };
};