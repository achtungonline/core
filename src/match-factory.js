var GameFactory = require("./game-factory");
var Match = require("./core/match");
var MatchState = require("./core/match-state.js");

module.exports = function MatchFactory() {
    var gameFactory = GameFactory();

    function create(options) {

        var matchConfig = options.matchConfig;
        var score = {};
        var roundWinners = [];

        matchConfig.playerConfigs.forEach(function (playerConfig) {
            score[playerConfig.id] = 0;
        });

        var matchState = MatchState(score, roundWinners, matchConfig.maxScore);

        return Match({
            matchState: matchState,
            gameFactory: gameFactory,
            matchConfig: matchConfig
        });
    }

    return {
        create: create
    };
};
