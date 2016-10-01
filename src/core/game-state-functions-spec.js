var gsf = require("./game-state-functions.js");

describe("game-state-functions", function() {

    it("getPlayer", function() {
        expect(() => gsf.getPlayer(gsf.createGameState({}))).toThrow();
        expect(() => gsf.getPlayer(gsf.createGameState({}), 0)).toThrow();

        expect(gsf.getPlayer(gsf.createGameState({players: [{id: 0}]}), 0)).toEqual({id: 0});
        expect(gsf.getPlayer(gsf.createGameState({players: [{id: 0}], worms: [{id: 1, playerId: 0}]}), 1)).toEqual({id: 0});
        expect(gsf.getPlayer(gsf.createGameState({players: [{id: 0}], worms: [{id: 1, playerId: 0}]}), 1)).toEqual({id: 0});
    });

    //it("addWormPathSegment", function() {
    //    //
    //    //expect(gsf.addWormPathSegments(gsf.createGameState({players: [{id: 0}]}), 0)).toEqual({id: 0});
    //    //expect(gsf.getPlayer(gsf.createGameState({players: [{id: 0}], worms: [{id: 1, playerId: 0}]}), 1)).toEqual({id: 0});
    //    //expect(gsf.getPlayer(gsf.createGameState({players: [{id: 0}], worms: [{id: 1, playerId: 0}]}), 1)).toEqual({id: 0});
    //});
});