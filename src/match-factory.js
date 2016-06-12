var GameFactory = require("./game-factory");
var Match = require("./core/match");
var MatchState = require("./core/match-state.js");

module.exports = function MatchFactory() {
    var gameFactory = GameFactory();

    function create(options) {

        var matchConfig = options.matchConfig;
        var score = {};
        var roundsWon = {};

        matchConfig.playerConfigs.forEach(function (playerConfig) {
            score[playerConfig.id] = 0;
            roundsWon[playerConfig.id] = 0;
        });

        var matchState = MatchState(score, roundsWon, matchConfig.maxScore);

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
