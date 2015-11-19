var ShapeModifierIFactory = require("../geometry/shape-modifier-immutable-factory.js");
var WormHandler = require("./worm-handler.js");
var JumpHandlerFactory = require("./jump-handler-factory.js");

var clone = require("../util/clone.js");

module.exports = function WormHandlerFactory(collisionHandler, wormBodyImmunityHandler, playAreaHandler, random) {
    var shapeModifierIFactory = ShapeModifierIFactory();
    var jumpHandlerFactory = JumpHandlerFactory(random);

    function create() {

        var shapeModifierI = shapeModifierIFactory.create();

        return WormHandler(playAreaHandler, collisionHandler, shapeModifierI, wormBodyImmunityHandler, clone, jumpHandlerFactory.create());
    }

    return {
        create: create
    };
};
