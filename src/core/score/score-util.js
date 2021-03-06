import forEach from "./../util/for-each.js";

function combineScores(scores1, scores2) {
    var res = {};
    forEach(scores1, (score,id) => {
        res[id] = score;
        if (scores2[id] !== undefined) {
            res[id] += scores2[id];
        }
    });
    forEach(scores2, (score,id) => {
        if (scores1[id] === undefined) {
            res[id] = scores2[id];
        }
    });
    return res;
}

function calculateRoundScore(gameState, time) {
    var res = {};
    gameState.players.forEach(function (player) {
        res[player.id] = -1;
    });
    var nextScore = 0;
    gameState.gameEvents.forEach(function (gameEvent) {
        if (time !== undefined && gameEvent.time > time) {
            return;
        }
        if (gameEvent.type === "player_died") {
            res[gameEvent.playerId] = nextScore;
            nextScore++;
        }
    });
    forEach(res, function(score, id) {
        if (score === -1) {
            res[id] = nextScore;
        }
    });
    return res;
}

function getStartScore(players) {
    var res = {};
    players.forEach(function (player) {
        res[player.id] = 0;
    });
    return res;
}

function getHighestScore(scores) {
    var res = 0;
    forEach(scores, function(score) {
        res = Math.max(res, score);
    });
    return res;
}

function createSortedList(scores) {
    var res = [];
    forEach(scores, function(score, id) {
        res.push({ score, id })
    });
    res.sort((p1, p2) => p2.score - p1.score);
    return res;
}

export {
    combineScores,
    calculateRoundScore,
    getStartScore,
    getHighestScore,
    createSortedList
};
