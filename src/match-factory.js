var GameFactory = require("./game-factory");
var Match = require("./core/match");

module.exports = function MatchFactory() {
    var gameFactory = GameFactory();

    function create(options) {
        var random = options.random;
        var matchConfig = options.matchConfig;
        return Match({
            gameFactory: gameFactory,
            random: random,
            matchConfig: matchConfig
        });
    }

    return {
        create: create
    };
};
