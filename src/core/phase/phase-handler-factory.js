var StartPhase = require("./start-phase.js").StartPhase;
var PlayPhase = require("./play-phase.js").PlayPhase;
var RoundOverPhase = require("./round-over-phase.js").RoundOverPhase;

var shapeSpatialRelations = require("./../geometry/shape-spatial-relations.js");
var ShapeModifierIFactory = require("./../geometry/shape-modifier-immutable-factory.js");

var mapUtils = require("./../map/map-utils.js");
var playerUtils = require("./../player/player-utils.js");

var PhaseHandler = require("./phase-handler.js");

module.exports = function RoundHandlerFactory(deps) {

    function createStartPhase() {
        var shapeModifierIFactory = ShapeModifierIFactory();
        var dependencies = {
            wormHandler: deps.wormHandler,
            shapeModifierI: shapeModifierIFactory.create(),
            shapeSpatialRelations: shapeSpatialRelations,
            mapUtils: mapUtils,
            playerUtils: playerUtils,
            random: deps.random,
            wormFactory: deps.wormFactory
        };

        return StartPhase(dependencies);
    }

    function createPlayPhase() {
        var dependencies = {
            wormHandler: deps.wormHandler,
            playerHandler: deps.playerHandler,
            powerUpHandler: deps.powerUpHandler,
            effectHandler: deps.effectHandler,
            playerUtils: playerUtils
        };
        return PlayPhase(dependencies);
    }

    function createRoundOverPhase() {
        return RoundOverPhase();
    }

    function create() {
        var phases = [];
        phases.push(createStartPhase());
        phases.push(createPlayPhase());
        phases.push(createRoundOverPhase());
        return PhaseHandler(phases);
    }

    return {
        create: create
    };
};
