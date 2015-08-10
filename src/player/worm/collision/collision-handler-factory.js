var CollisionHandler = require("./collision-handler.js");

var shapeSpatialRelations = require("./../../../geometry/shape-spatial-relations.js");
var mapUtils = require("./../../../map/map-utils");

module.exports = function CollisionHandlerFactory(wormBodyGridHandler, wormBodyImmunityHandler, shapeSpatialRelations) {
    function create() {
        return CollisionHandler(wormBodyGridHandler, wormBodyImmunityHandler, shapeSpatialRelations, mapUtils);
    }

    return {
        create: create
    }
};