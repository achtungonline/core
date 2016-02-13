var ShapeModifierIFactory = require("../geometry/shape-modifier-immutable-factory.js");
var WormHandler = require("./worm-handler.js");
var JumpHandlerFactory = require("./jump-handler-factory.js");

var clone = require("../util/clone.js");

module.exports = function WormHandlerFactory(collisionHandler, wormBodyImmunityHandler, playAreaHandler, effectHandler) {
    var shapeModifierIFactory = ShapeModifierIFactory();
    var jumpHandlerFactory = JumpHandlerFactory();

    function create() {

        var shapeModifierI = shapeModifierIFactory.create();

        return WormHandler(playAreaHandler, collisionHandler, shapeModifierI, wormBodyImmunityHandler, clone, jumpHandlerFactory.create(), effectHandler);
    }

    return {
        create: create
    };
};
