var ShapeModifierIFactory = require("./../../geometry/shape-modifier-immutable-factory.js");
var WormHandler = require("./worm-handler.js");
var WormBodyImmunityHandler = require("./worm-body-immunity-handler.js");
var JumpHandlerFactory = require("./jump-handler-factory.js");
var CollisionHandlerFactory = require("./collision/collision-handler-factory.js");

var clone = require("./../../util/clone.js");

module.exports = function WormHandlerFactory(playAreaHandler, random) {
    var shapeModifierIFactory = ShapeModifierIFactory();
    var jumpHandlerFactory = JumpHandlerFactory(random);

    function create() {
        var wormBodyImmunityHandler = WormBodyImmunityHandler();

        var shapeModifierI = shapeModifierIFactory.create();
        var collisionHandler = CollisionHandlerFactory(playAreaHandler, wormBodyImmunityHandler).create();

        return WormHandler(playAreaHandler, collisionHandler, shapeModifierI, wormBodyImmunityHandler, clone, jumpHandlerFactory.create());
    }

    return {
        create: create
    };
};