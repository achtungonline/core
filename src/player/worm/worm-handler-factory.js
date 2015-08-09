var ShapeModifierIFactory = require("./../../geometry/shape-modifier-immutable-factory.js");
var WormHandler = require("./worm-handler.js");
var WormBodyGridHandler = require("./worm-body-grid-handler.js");
var WormBodyImmunityHandler = require("./worm-body-immunity-handler.js");
var BodyPartDeciderHandler = require("./body-part-decider-handler.js");
var JumpFactory = require("./jump-factory.js");

var shapeSpatialRelations = require("./../../geometry/shape-spatial-relations.js");
var clone = require("./../../util/clone.js");

module.exports = function WormHandlerFactory(wormGridFactory, eventHandler) {
    var shapeModifierIFactory = ShapeModifierIFactory();
    var jumpFactory = JumpFactory();

    function create() {
        var wormBodyGridHandler = WormBodyGridHandler(wormGridFactory);
        var wormBodyImmunityHandler = WormBodyImmunityHandler(shapeSpatialRelations);

        var shapeModifierI = shapeModifierIFactory.create();
        var bodyPartDeciderHandler = BodyPartDeciderHandler(jumpFactory);

        return WormHandler(eventHandler, shapeModifierI, wormBodyGridHandler, wormBodyImmunityHandler, clone, bodyPartDeciderHandler);
    }

    return {
        create: create
    }
};