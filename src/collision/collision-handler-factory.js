var CollisionHandler = require("./collision-handler.js");
var WormWormCollisionHandler = require("./worm-worm-collision-handler.js");

var shapeSpatialRelations = require("./../geometry/shape-spatial-relations.js");
var mapUtils = require("./../map/map-utils");

module.exports = function CollisionHandlerFactory(eventHandler, wormHandler) {
    function create() {
        var wormWormCollisionHandler = WormWormCollisionHandler(eventHandler, wormHandler, shapeSpatialRelations);
        return CollisionHandler(eventHandler, wormWormCollisionHandler, mapUtils);
    }

    return {
        create: create
    }
};