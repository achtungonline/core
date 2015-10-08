var StartPhase = require("./phase/start-phase.js").StartPhase;
var PlayPhase = require("./phase/play-phase.js").PlayPhase;
var RoundOverPhase = require("./phase/round-over-phase.js").RoundOverPhase;

var shapeSpatialRelations = require("./../geometry/shape-spatial-relations.js");
var ShapeModifierIFactory = require("./../geometry/shape-modifier-immutable-factory.js");

var mapUtils = require("./../map/map-utils.js");
var playerUtils = require("./../player/player-utils.js");

/**
 * A phase is a sort of logical concept within a game round. Such as the starting phase when the worms don't move and the play phase which is when they start moving.
 * @param wormHandler
 * @param playerHandler
 * @returns {{createStartPhase: createStartPhase, createPlayPhase: createPlayPhase, createRoundOverPhase: createRoundOverPhase}}
 * @constructor
 */
module.exports = function PhaseFactory(deps) {
    var shapeModifierIFactory = ShapeModifierIFactory();

    function createStartPhase() {
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

    return {
        createStartPhase: createStartPhase,
        createPlayPhase: createPlayPhase,
        createRoundOverPhase: createRoundOverPhase
    };
};