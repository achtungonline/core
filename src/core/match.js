var scoreUtil = require("./score/score-util.js");

module.exports = function Match({ matchState, gameFactory, matchConfig }) {

    var currentGame;

    function addRoundData(roundData) {
        matchState.roundsData.push(roundData);
        matchState.score = scoreUtil.combineScores(matchState.score, roundData.roundScore);
    }

    function getCurrentGame() {
        return currentGame;
    }

    function isMaxScoreReached() {
        var scoreSortedPlayers = scoreUtil.createSortedList(matchState.score);
        if(scoreSortedPlayers[0].score - scoreSortedPlayers[1].score < 2) {
            return false; // Leading player is not leading by 2 points.
        }
        return scoreSortedPlayers[0].score >= matchConfig.maxScore;
    }

    function isMatchOver() {
        return currentGame && !currentGame.isActive() && isMaxScoreReached();
    }

    function prepareNextGame(seed) {
        currentGame = gameFactory.create({
            seed: seed,
            map: matchConfig.map,
            players: matchConfig.players
        });
        return currentGame;
    }

    return {
        addRoundData,
        getCurrentGame,
        prepareNextGame,
        isMatchOver,
        matchConfig,
        matchState
    }
};
