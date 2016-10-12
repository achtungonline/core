var clear = require("./clear");
var gsf = require("../../game-state-functions.js");

describe("effect", function () {

    describe("clear", function () {
        function createGameState() {
            return {
                players: [{id: "p1"}, {id: "p2"}],
                playArea: {grid: ["p1_w1", "p2_w2"]},
                worms: [{id: "w1", playerId: "p1"}, {id: "w2", playerId: "p2"}],
                wormPathSegments: {"p1_w1": [{playerId: "p1", wormId: "w1"}], "p2_w2": [{playerId: "p2", wormId: "w2"}]}
            }
        }

        it("Test self", function () {
            var gameState = createGameState();
            clear.activate({gameState, wormId: "w1", affects: "self"});

            expect(gsf.getLatestWormPathSegment(gameState, "p1_w1").type).toEqual("clear");
            expect(gsf.getLatestWormPathSegment(gameState, "p2_w2").type).not.toEqual("clear");
            expect(gameState.playArea.grid).toEqual([-1, "p2_w2"]);
        });

        it("Test other", function () {
            var gameState = createGameState();
            clear.activate({gameState, wormId: "w1", affects: "others"});

            expect(gsf.getLatestWormPathSegment(gameState, "p1_w1").type).not.toEqual("clear");
            expect(gsf.getLatestWormPathSegment(gameState, "p2_w2").type).toEqual("clear");
            expect(gameState.playArea.grid).toEqual(["p1_w1", -1]);
        });

        it("Test all", function () {
            var gameState = createGameState();
            clear.activate({gameState, wormId: "w1", affects: "all"});

            expect(gsf.getLatestWormPathSegment(gameState, "p1_w1").type).toEqual("clear");
            expect(gsf.getLatestWormPathSegment(gameState, "p2_w2").type).toEqual("clear");
            expect(gameState.playArea.grid).toEqual([-1, -1]);
        });
    });
});