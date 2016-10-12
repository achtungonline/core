var GameFactory = require("../game-factory.js");
var gameStateFunctions = require("./game-state-functions.js");
var scoreUtil = require("./score/score-util.js");

module.exports = function Match({ matchConfig }) {
    var gameFactory = GameFactory();

    var matchState = {
        roundsData: []
    };

    function addFinishedGameState(gameState) {
        var startScore = getCurrentScore();
        var roundScore = scoreUtil.calculateRoundScore(gameState);
        var endScore = scoreUtil.combineScores(startScore, roundScore);
        var replayGameState = gameStateFunctions.extractReplayGameState(gameState);
        matchState.roundsData.push({ startScore, roundScore, endScore, gameState: replayGameState });
    }

    function getCurrentScore() {
        if (matchState.roundsData.length === 0) {
            return scoreUtil.getStartScore(matchConfig.players);
        } else {
            return matchState.roundsData[matchState.roundsData.length - 1].endScore;
        }
    }

    function isMatchOver() {
        function isMaxScoreReached() {
            var scoreSortedPlayers = scoreUtil.createSortedList(getCurrentScore());
            if(scoreSortedPlayers[0].score - scoreSortedPlayers[1].score < 2) {
                return false; // Leading player is not leading by 2 points.
            }
            return scoreSortedPlayers[0].score >= matchConfig.maxScore;
        }

        return isMaxScoreReached();
    }

    function prepareNextGame(seed) {
        return gameFactory.create({
            seed: seed,
            map: matchConfig.map,
            players: matchConfig.players
        });
    }

    return {
        addFinishedGameState,
        getCurrentScore,
        prepareNextGame,
        isMatchOver,
        matchConfig,
        matchState
    }
};
