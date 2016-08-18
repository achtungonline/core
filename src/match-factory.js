var GameFactory = require("./game-factory");
var Match = require("./core/match");

module.exports = function MatchFactory() {
    var gameFactory = GameFactory();

    function create({ matchConfig }) {

        var score = {};
        var roundsData = [];

        matchConfig.playerConfigs.forEach(function (playerConfig) {
            score[playerConfig.id] = 0;
        });

        var matchState = {
            score,
            roundsData
        };

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
