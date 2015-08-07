var StartPhase = require("./phase/start-phase.js").StartPhase;
var PlayPhase = require("./phase/play-phase.js").PlayPhase;
var RoundOverPhase = require("./phase/round-over-phase.js").RoundOverPhase;

var shapeSpatialRelations = require("./../geometry/shape-spatial-relations.js");
var ShapeModifierIFactory = require("./../geometry/shape-modifier-immutable-factory.js");
var mapUtils = require("./../map/map-utils.js");

module.exports = function PhaseFactory(eventHandler, wormHandler, collisionHandler) {
    var shapeModifierIFactory = ShapeModifierIFactory();

    function createStartPhase() {
        return StartPhase(eventHandler, wormHandler, shapeModifierIFactory.create(), shapeSpatialRelations, mapUtils);
    }

    function createPlayPhase() {
        return PlayPhase(eventHandler, wormHandler, collisionHandler);
    }

    function createRoundOverPhase() {
        return RoundOverPhase();
    }

    return {
        createStartPhase: createStartPhase,
        createPlayPhase: createPlayPhase,
        createRoundOverPhase: createRoundOverPhase
    }
}