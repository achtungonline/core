var ShapeModifierIFactory = require("./../../geometry/shape-modifier-immutable-factory.js");
var WormHandler = require("./worm-handler.js");
var WormBodyGridHandler = require("./worm-body-grid-handler.js");
var WormBodyImmunityHandler = require("./worm-body-immunity-handler.js");

var shapeSpatialRelations = require("./../../geometry/shape-spatial-relations.js");
var clone = require("./../../util/clone.js");

module.exports = function WormHandlerFactory(wormGridFactory) {
    var shapeModifierIFactory = ShapeModifierIFactory();

    function create() {
        var wormBodyGridHandler = WormBodyGridHandler(wormGridFactory);
        var wormBodyImmunityHandler = WormBodyImmunityHandler(shapeSpatialRelations);

        var shapeModifierI = shapeModifierIFactory.create();

        return WormHandler(shapeModifierI, wormBodyGridHandler, wormBodyImmunityHandler, clone);
    }

    return {
        create: create
    }
};