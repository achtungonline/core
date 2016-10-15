import * as scoreUtil from "./score-util";

describe("Score", function () {

    it("start score", function () {
        var players = [{id: "p2"}, {id: "p13"}];
        var score = scoreUtil.getStartScore(players);
        expect(Object.keys(score).length).toEqual(players.length);
        players.forEach(player => expect(score[player.id]).toEqual(0));
    });

    it("combine scores", function () {
        var score = scoreUtil.combineScores({"p1": 0}, {"p1": 2});
        expect(score).toEqual({"p1": 2});

        score = scoreUtil.combineScores({"p1": 0, "p2": 5}, {"p1": 2});
        expect(score).toEqual({"p1": 2, "p2": 5});

        score = scoreUtil.combineScores({"p1": 12345}, {"p1": 4324, "p23": 0});
        expect(score).toEqual({"p1": 16669, "p23": 0});
    });

    it("get highest score", function () {
        var score = {"p2": 3, "p3": 0, "p15": 10};
        expect(scoreUtil.getHighestScore(score)).toEqual(10);
    });

    it("create sorted list", function () {
        var score = {"p2": 3, "p3": 0, "p15": 10};
        expect(scoreUtil.createSortedList(score)).toEqual([{id: "p15", score: 10}, {id: "p2", score: 3}, {id: "p3", score: 0}]);
    });

    it("calculate round score", function () {
        var gameState = {
            players: [{id: "p1"}, {id: "p2"}, {id: "p3"}],
            gameEvents: [{time: 1, type: "player_died", playerId: "p1"}, {time: 2, type: "player_died", playerId: "p3"}]
        };
        expect(scoreUtil.calculateRoundScore(gameState)).toEqual({"p1": 0, "p2": 2, "p3": 1});
    });

    it("calculate round score partial", function () {
        var gameState = {
            players: [{id: "p1"}, {id: "p2"}, {id: "p3"}],
            gameEvents: [{time: 1, type: "player_died", playerId: "p1"}, {time: 2, type: "player_died", playerId: "p3"}]
        };
        expect(scoreUtil.calculateRoundScore(gameState, 1.5)).toEqual({"p1": 0, "p2": 1, "p3": 1});
    });
});
