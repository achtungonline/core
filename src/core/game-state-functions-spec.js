import * as gsf from "./game-state-functions.js";
import "phantomjs-polyfill-find/find-polyfill.js";

import objectCleaner from "./util/object-cleaner.js";

describe("game-state-functions", function () {

    describe("createWormPathSegment", function () {
        it("basic test", function () {
            expect(gsf.createWormPathSegment({
                gameTime: 1,
                players: [{id: "p1"}],
                worms: [{id: "w1", playerId: "p1"}],
                wormPathSegments: {"p1_w1": [{}]}
            }, "w1", {duration: 1, centerX: 10, centerY: 20, direction: 2, speed: 60, turningVelocity: 0, jump: false, size: 2})).toEqual(
                {
                    duration: 1,
                    startX: 10,
                    startY: 20,
                    endX: -14.968810192828546,
                    endY: 74.5578456095409,
                    startDirection: 2,
                    endDirection: 2,
                    speed: 60,
                    turningVelocity: 0,
                    type: "straight",
                    startTime: 0,
                    endTime: 1,
                    jump: false,
                    size: 2,
                    playerId: "p1",
                    wormId: "w1",
                    id: "p1_w1"
                }
            );
        });

        it("Test with duration 0", function () {
            expect(gsf.createWormPathSegment({
                gameTime: 1,
                players: [{id: "p1"}],
                worms: [{id: "w1", playerId: "p1"}],
                wormPathSegments: {"p1_w1": [{}]}
            }, "w1", {duration: 0, centerX: 10, centerY: 20, direction: 2, speed: 60, turningVelocity: 0, jump: false, size: 2})).toEqual(
                {
                    duration: 0,
                    startX: 10,
                    startY: 20,
                    endX: 10,
                    endY: 20,
                    startDirection: 2,
                    endDirection: 2,
                    speed: 60,
                    turningVelocity: 0,
                    type: "straight",
                    startTime: 1,
                    endTime: 1,
                    jump: false,
                    size: 2,
                    playerId: "p1",
                    wormId: "w1",
                    id: "p1_w1"
                }
            );
        });

        it("Test without parameters", function () {
            expect(gsf.createWormPathSegment({
                gameTime: 1,
                players: [{id: "p1"}],
                worms: [{id: "w1", playerId: "p1"}],
                wormPathSegments: {"p1_w1": [{endX: 10, endY: 20, endDirection: 50, speed: 60, jump: false, turningVelocity: 0, size: 2}]}
            }, "w1")).toEqual(
                {
                    duration: 0,
                    startX: 10,
                    startY: 20,
                    endX: 10,
                    endY: 20,
                    startDirection: 50,
                    endDirection: 50,
                    speed: 60,
                    turningVelocity: 0,
                    type: "straight",
                    startTime: 1,
                    endTime: 1,
                    jump: false,
                    size: 2,
                    playerId: "p1",
                    wormId: "w1",
                    id: "p1_w1"
                }
            );
        });
    });

    it("getLatestWormPathSegment", function () {
        expect(gsf.getLatestWormPathSegment({wormPathSegments: {"1": []}}, "1")).toEqual(null);
        expect(gsf.getLatestWormPathSegment({wormPathSegments: {}}, "1")).toEqual(null);
        expect(gsf.getLatestWormPathSegment({wormPathSegments: {"1": [{id: "1"}, {id: "1", someVal: "someVal"}]}}, "1")).toEqual({id: "1", someVal: "someVal"});
    });

    it("getGameStateChanges", function () {
        var gameState = {
            gameTime: 5,
            wormPathSegments: {
                "1": [{ endTime: 2 },{ endTime: 4}]
            },
            gameEvents: [{ time: 2.5 }, {time: 3.5}],
            powerUpEvents: [{ time: 3 }, {time: 3}],
            effectEvents: [{ time: 1 }, {time: 2}]
        };

        expect(gsf.getGameStateChanges(gameState, 2)).toEqual({
            gameTime: 5,
            wormPathSegments: {
                "1": [{ endTime: 2, index: 0 },{ endTime: 4, index: 1}]
            },
            gameEvents: [{ time: 2.5 }, {time: 3.5}],
            powerUpEvents: [{ time: 3 }, {time: 3}],
            effectEvents: [{ time: 2 }]
        });
        expect(gsf.getGameStateChanges(gameState, 2.6)).toEqual({
            gameTime: 5,
            wormPathSegments: {
                "1": [{ endTime: 4, index: 1}]
            },
            gameEvents: [{time: 3.5}],
            powerUpEvents: [{ time: 3 }, {time: 3}],
            effectEvents: []
        });
        expect(gsf.getGameStateChanges(gameState, 3.7)).toEqual({
            gameTime: 5,
            wormPathSegments: {
                "1": [{ endTime: 4, index: 1}]
            },
            gameEvents: [],
            powerUpEvents: [],
            effectEvents: []
        });
        expect(gsf.getGameStateChanges(gameState, 4.01)).toEqual({
            gameTime: 5,
            wormPathSegments: {},
            gameEvents: [],
            powerUpEvents: [],
            effectEvents: []
        });
    });

    it("addWormPathSegment", function () {
        var gameState = {wormPathSegments: {}};
        gsf.addWormPathSegment(gameState, {id: "1", wormId: "2", type: "arc", duration: 1});
        expect(objectCleaner(gameState)).toEqual({
            wormPathSegments: {
                "1": [
                    {id: "1", wormId: "2", type: "arc", duration: 1}]
            }
        });

        gsf.addWormPathSegment(gameState, {id: "1", wormId: "2", type: "arc", duration: 2});
        expect(objectCleaner(gameState)).toEqual({
            wormPathSegments: {
                "1": [
                    {id: "1", wormId: "2", type: "arc", duration: 3}]
            }
        });

        gsf.addWormPathSegment(gameState, {id: "1", wormId: "2", type: "straight", duration: 2});
        expect(objectCleaner(gameState)).toEqual({
            wormPathSegments: {
                "1": [
                    {id: "1", wormId: "2", type: "arc", duration: 3},
                    {id: "1", wormId: "2", type: "straight", duration: 2}]
            }
        });
    });

    it("getPlayer", function () {
        expect(() => gsf.getPlayer(gsf.createGameState({}))).toThrow();
        expect(() => gsf.getPlayer(gsf.createGameState({}), "0")).toThrow();

        expect(gsf.getPlayer(gsf.createGameState({players: [{id: "0"}]}), "0")).toEqual({id: "0"});
        expect(gsf.getPlayer(gsf.createGameState({players: [{id: "0"}], worms: [{id: "1", playerId: "0"}]}), "1")).toEqual({id: "0"});
        expect(gsf.getPlayer(gsf.createGameState({players: [{id: "0"}], worms: [{id: "1", playerId: "0"}]}), "1")).toEqual({id: "0"});
        expect(gsf.getPlayer(gsf.createGameState({players: [{id: "0"}], wormPathSegments: {"1": [{playerId: "0"}]}}), "1")).toEqual({id: "0"});
    });
});