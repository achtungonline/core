var gsf = require("./game-state-functions.js");
require("phantomjs-polyfill-find/find-polyfill.js");

import objectCleaner from './util/object-cleaner.js';

describe("game-state-functions", function () {
    it("getPlayer", function () {
        expect(() => gsf.getPlayer(gsf.createGameState({}))).toThrow();
        expect(() => gsf.getPlayer(gsf.createGameState({}), "0")).toThrow();

        expect(gsf.getPlayer(gsf.createGameState({players: [{id: "0"}]}), "0")).toEqual({id: "0"});
        expect(gsf.getPlayer(gsf.createGameState({players: [{id: "0"}], worms: [{id: "1", playerId: "0"}]}), "1")).toEqual({id: "0"});
        expect(gsf.getPlayer(gsf.createGameState({players: [{id: "0"}], worms: [{id: "1", playerId: "0"}]}), "1")).toEqual({id: "0"});
        expect(gsf.getPlayer(gsf.createGameState({players: [{id: "0"}], wormPathSegments: {"1": [{playerId: "0"}]}}), "1")).toEqual({id: "0"});
    });

    it("addWormPathSegmentMetaData", function () {
        var gameState = gsf.createSimpleGameState({
            wormPathSegments: {
                0: [
                    {someValue: "something", metaData: []}]
            }
        });
        gsf.addWormPathSegmentMetaData(gameState, 0, {type: "clear"}, false);
        expect(gameState).toEqual({
            wormPathSegments: {
                0: [
                    {someValue: "something", metaData: [{type: "clear"}]}]
            }
        });


        //duration: 0,
        //    startX: segment.endX,
        //    startY: segment.endY,
        //    startDirection: segment.endDirection,
        //    speed: segment.speed,
        //    turningVelocity: segment.turningVelocity

        gameState = gsf.createSimpleGameState({
            gameTime: 200,
            wormPathSegments: {
                0: [
                    {
                        duration: 0.9020000000000006,
                        metaData: [],
                        index: 0,
                        startTime: 200,
                        type: 'arc'
                    }]
            }
        });

        gsf.addWormPathSegmentMetaData(gameState, 0, {type: "clear"}, true);
        expect(objectCleaner(gameState)).toEqual({
            gameTime: 200,
            wormPathSegments: {
                0: [
                    {
                        duration: 0.9020000000000006,
                        metaData: [],
                        index: 0,
                        startTime: 200,
                        type: 'arc'
                    },
                    {
                        duration: 0,
                        metaData: [{type: "clear"}],
                        startTime: 200,
                        endTime: 200,
                        type: 'arc',
                        index: 1
                    },
                    {
                        duration: 0,
                        startTime: 200,
                        endTime: 200,
                        metaData: [],
                        type: 'arc',
                        index: 2
                    }
                ]
            }
        });
    });
});