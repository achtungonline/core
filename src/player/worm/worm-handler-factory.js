var ShapeModifierIFactory = require("./../../geometry/shape-modifier-immutable-factory.js");
var WormHandler = require("./worm-handler.js");
var WormBodyImmunityHandler = require("./worm-body-immunity-handler.js");
var BodyPartDeciderHandler = require("./body-part-decider-handler.js");
var JumpFactory = require("./jump-factory.js");
var CollisionHandlerFactory = require("./collision/collision-handler-factory.js");

var clone = require("./../../util/clone.js");

module.exports = function WormHandlerFactory(playAreaHandler) {
    var shapeModifierIFactory = ShapeModifierIFactory();
    var jumpFactory = JumpFactory();

    function create() {
        var wormBodyImmunityHandler = WormBodyImmunityHandler();

        var shapeModifierI = shapeModifierIFactory.create();
        var bodyPartDeciderHandler = BodyPartDeciderHandler(jumpFactory);
        var collisionHandler = CollisionHandlerFactory(playAreaHandler, wormBodyImmunityHandler).create();

        return WormHandler(playAreaHandler, collisionHandler, shapeModifierI, wormBodyImmunityHandler, clone, bodyPartDeciderHandler);
    }

    return {
        create: create
    };
};