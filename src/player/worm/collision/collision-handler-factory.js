var CollisionHandler = require("./collision-handler.js");

var mapUtils = require("./../../../map/map-utils");

module.exports = function CollisionHandlerFactory(playAreaHandler, wormBodyImmunityHandler) {
    function create() {
        return CollisionHandler(playAreaHandler, wormBodyImmunityHandler, mapUtils);
    }

    return {
        create: create
    };
};