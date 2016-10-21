import * as twin from "./twin";
import * as gsf from "../../game-state-functions.js";
import * as wormSwitch from "./worm-switch.js";

import objectCleaner from "../../util/object-cleaner.js";

describe("effect", function () {

    describe("twin", function () {
        function createGameState() {
            return {
                nextId: 0,
                players: [{id: "p1"}, {id: "p2"}],
                playArea: {grid: ["p1_w1", "p2_w2"]},
                worms: [{id: "w1", playerId: "p1", alive: true, centerX: 10, centerY: 10}, {id: "w2", playerId: "p2", alive: true}],
                wormPathSegments: {"p1_w1": [{playerId: "p1", wormId: "w1"}], "p2_w2": [{playerId: "p2", wormId: "w2"}]},
                effects: [],
                effectEvents: []
            }
        }

        it("Test self", function () {
            var gameState = createGameState();
            twin.activate({gameState, wormId: "w1", affects: "self"});

            expect(gsf.getAliveWorms(gameState).length).toEqual(3);
            expect(gsf.getAliveWorms(gameState, "p1").length).toEqual(2);
            expect(gsf.getAliveWorms(gameState, "p2").length).toEqual(1);

            expect(objectCleaner(gameState.effects)).toEqual([{
                id: "effect_1",
                timeLeft: 10000,
                twinWormId: "w1",
                type: "twin",
                wormId: "worm_0"
            }, {
                id: "effect_2",
                timeLeft: 10000,
                twinWormId: "worm_0",
                type: "twin",
                wormId: "w1"
            }]);
        });

        it("Test other", function () {
            var gameState = createGameState();
            twin.activate({gameState, wormId: "w1", affects: "others"});

            expect(gsf.getAliveWorms(gameState).length).toEqual(3);
            expect(gsf.getAliveWorms(gameState, "p1").length).toEqual(1);
            expect(gsf.getAliveWorms(gameState, "p2").length).toEqual(2);

            expect(objectCleaner(gameState.effects)).toEqual([{
                id: "effect_1",
                timeLeft: 10000,
                twinWormId: "w2",
                type: "twin",
                wormId: "worm_0"
            }, {
                id: "effect_2",
                timeLeft: 10000,
                twinWormId: "worm_0",
                type: "twin",
                wormId: "w2"
            }]);

        });

        it("Test all", function () {
            var gameState = createGameState();
            twin.activate({gameState, wormId: "w1", affects: "all"});

            expect(gsf.getAliveWorms(gameState).length).toEqual(4);
            expect(gsf.getAliveWorms(gameState, "p1").length).toEqual(2);
            expect(gsf.getAliveWorms(gameState, "p2").length).toEqual(2);

            expect(objectCleaner(gameState.effects)).toEqual([{
                id: "effect_1",
                timeLeft: 10000,
                twinWormId: "w1",
                type: "twin",
                wormId: "worm_0"
            }, {
                id: "effect_2",
                timeLeft: 10000,
                twinWormId: "worm_0",
                type: "twin",
                wormId: "w1"
            }, {
                id: "effect_4",
                timeLeft: 10000,
                twinWormId: "w2",
                type: "twin",
                wormId: "worm_3"
            }, {
                id: "effect_5",
                timeLeft: 10000,
                twinWormId: "worm_3",
                type: "twin",
                wormId: "w2"
            }]);
        });

        it("Test that effect gets removed once they are far enough away from each other", function () {
            var gameState = {
                nextId: 0,
                players: [{id: "p1"}],
                playArea: {grid: ["p1_w1", "p2_w2"]},
                worms: [gsf.createWorm(null, {id: "w1", playerId: "p1", centerX: 0, centerY: 0, radius: 2})],
                wormPathSegments: {"p1_w1": [{playerId: "p1", wormId: "w1"}], "p2_w2": [{playerId: "p2", wormId: "w2"}]},
                effects: [],
                effectEvents: []
            };

            twin.activate({gameState, wormId: "w1", affects: "self"});

            // We move w1 just enough away from worm_0 so the effect should still be active
            gsf.getWorm(gameState, "w1").centerX = 4;
            twin.update(gameState, null, gameState.effects[0]);
            twin.update(gameState, null, gameState.effects[1]);
            // Nothing should have happened
            expect(objectCleaner(gameState.effects)).toEqual([{
                id: "effect_1",
                timeLeft: 10000,
                twinWormId: "w1",
                type: "twin",
                wormId: "worm_0"
            }, {
                id: "effect_2",
                timeLeft: 10000,
                twinWormId: "worm_0",
                type: "twin",
                wormId: "w1"
            }]);

            // Now we move "w1" a bit further
            gsf.getWorm(gameState, "w1").centerX = 5;
            twin.update(gameState, null, gameState.effects[0]);
            twin.update(gameState, null, gameState.effects[1]);
            expect(objectCleaner(gameState.effects)).toEqual([{
                id: "effect_1",
                timeLeft: 0,
                twinWormId: "w1",
                type: "twin",
                wormId: "worm_0"
            }, {
                id: "effect_2",
                timeLeft: 0,
                twinWormId: "worm_0",
                type: "twin",
                wormId: "w1"
            }]);
        });
    });
});