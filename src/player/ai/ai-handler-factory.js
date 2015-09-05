var TrajectoryHandler = require("../../geometry/trajectory/trajectory-handler.js");
var CollisionHandlerFactory = require("../worm/collision/collision-handler-factory.js");
var AIHandler = require("./ai-handler.js");
var Random = require("../../util/random.js");

module.exports = function AIHandlerFactory(game, playAreaHandler) {

    function create() {
        var trajectoryHandler = TrajectoryHandler();
        var collisionHandler = CollisionHandlerFactory(playAreaHandler).create();
        var random = Random();

        return AIHandler(game, collisionHandler, trajectoryHandler, random);
    }

    return {
        create: create
    }
}