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

    it("addClearPathSegment", function () {
        var gameState = gsf.createSimpleGameState({
            gameTime: 200,
            wormPathSegments: {
                0: [
                    {
                        duration: 0.9020000000000006,
                        index: 0,
                        startTime: 200,
                        type: 'arc'
                    }]
            }
        });

        gsf.addClearPathSegment(gameState, 0);
        expect(objectCleaner(gameState)).toEqual({
            gameTime: 200,
            wormPathSegments: {
                0: [
                    {
                        duration: 0.9020000000000006,
                        index: 0,
                        startTime: 200,
                        type: 'arc'
                    },
                    {
                        duration: 0,
                        startTime: 200,
                        endTime: 200,
                        type: 'clear',
                        index: 1
                    }
                ]
            }
        });
    });
});