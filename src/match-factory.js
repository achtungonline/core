var GameFactory = require("./game-factory");
var Match = require("./core/match");

module.exports = function MatchFactory() {
    var gameFactory = GameFactory();

    function create(options) {
        var seed = options.seed;
        var matchConfig = options.matchConfig;
        return Match({
            gameFactory: gameFactory,
            seed: seed,
            matchConfig: matchConfig
        });
    }

    return {
        create: create
    };
};
