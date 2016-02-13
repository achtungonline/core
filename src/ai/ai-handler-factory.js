var TrajectoryHandler = require("../core/geometry/trajectory/trajectory-handler.js");
var CollisionHandlerFactory = require("../core/collision/collision-handler-factory.js");
var AIHandler = require("./ai-handler.js");

var PathCheckerAIHandler = require("./path-checker-ai-handler.js");
var RandomAIHandler = require("./random-ai-handler.js");

module.exports = function AIHandlerFactory(game, playAreaHandler) {

    function create() {
        var trajectoryHandler = TrajectoryHandler();
        var collisionHandler = CollisionHandlerFactory(playAreaHandler).create();

        var ais = [];
        var pathCheckerAiHandler = PathCheckerAIHandler(game, collisionHandler, trajectoryHandler);
        var randomAiHandler = RandomAIHandler(game);

        ais[pathCheckerAiHandler.type] = pathCheckerAiHandler;
        ais[randomAiHandler.type] = randomAiHandler;

        return AIHandler(game, ais, pathCheckerAiHandler.type);
    }

    return {
        create: create
    };
};
