var TrajectoryHandler = require("../../geometry/trajectory/trajectory-handler.js");
var CollisionHandlerFactory = require("../worm/collision/collision-handler-factory.js");
var AIHandler = require("./ai-handler.js");

module.exports = function AIHandlerFactory(game, playAreaHandler, random) {

    function create() {
        var trajectoryHandler = TrajectoryHandler();
        var collisionHandler = CollisionHandlerFactory(playAreaHandler).create();

        return AIHandler(game, collisionHandler, trajectoryHandler, random);
    }

    return {
        create: create
    };
};