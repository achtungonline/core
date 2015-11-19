var CollisionHandler = require("./collision-handler.js");

var mapUtils = require("../map/map-utils");
var shapeSpatialRelations = require("../geometry/shape-spatial-relations.js");

module.exports = function CollisionHandlerFactory(playAreaHandler, wormBodyImmunityHandler) {
    function create() {
        return CollisionHandler(playAreaHandler, wormBodyImmunityHandler, mapUtils, shapeSpatialRelations);
    }

    return {
        create: create
    };
};
