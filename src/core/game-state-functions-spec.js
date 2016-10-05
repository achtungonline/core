var gsf = require("./game-state-functions.js");

//jasmine.pp = function (obj) {
//    return JSON.stringify(obj, undefined, 2);
//};

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

        gameState = gsf.createSimpleGameState({
            gameTime: 200,
            wormPathSegments: {
                0: [
                    {
                        duration: 0.9020000000000006,
                        startX: 454.1021586650029,
                        startY: 109.67382746062911,
                        startDirection: 12.333971739254988,
                        speed: 90,
                        turningVelocity: 3,
                        type: "arc",
                        arcCenterX: 461.0115357473077,
                        arcCenterY: 138.8673285924653,
                        arcRadius: 30,
                        arcStartAngle: 10.763175412460091,
                        arcAngleDiff: 2.7060000000000013,
                        arcEndAngle: 13.469175412460098,
                        endX: 479.59384931496,
                        endY: 162.41934809129864,
                        endDirection: 15.039971739254995,
                        startTime: 26.76199999999935,
                        endTime: 27.663999999999312,
                        jump: false,
                        size: 4,
                        playerId: "player_1",
                        wormId: "worm_0",
                        metaData: [],
                        index: 0
                    }]
            }
        });

        gsf.addWormPathSegmentMetaData(gameState, 0, {type: "clear"}, true);
        expect(gameState).toEqual({
            gameTime: 200,
            wormPathSegments: {
                0: [
                    {
                        duration: 0.9020000000000006,
                        startX: 454.1021586650029,
                        startY: 109.67382746062911,
                        startDirection: 12.333971739254988,
                        speed: 90,
                        turningVelocity: 3,
                        type: "arc",
                        arcCenterX: 461.0115357473077,
                        arcCenterY: 138.8673285924653,
                        arcRadius: 30,
                        arcStartAngle: 10.763175412460091,
                        arcAngleDiff: 2.7060000000000013,
                        arcEndAngle: 13.469175412460098,
                        endX: 479.59384931496,
                        endY: 162.41934809129864,
                        endDirection: 15.039971739254995,
                        startTime: 26.76199999999935,
                        endTime: 27.663999999999312,
                        jump: false,
                        size: 4,
                        playerId: "player_1",
                        wormId: "worm_0",
                        metaData: [],
                        index: 0
                    },
                    {
                        duration: 0,
                        startX: 479.59384931496,
                        startY: 162.41934809129864,
                        startDirection: 15.039971739254995,
                        speed: 90,
                        turningVelocity: 3,
                        type: "arc",
                        arcCenterX: 461.01153574730796,
                        arcCenterY: 138.86732859246464,
                        arcRadius: 30,
                        arcStartAngle: 13.469175412460098,
                        arcAngleDiff: 0,
                        arcEndAngle: 13.469175412460098,
                        endX: 479.5938493149599,
                        endY: 162.41934809129867,
                        endDirection: 15.039971739254995,
                        startTime: 200,
                        endTime: 200,
                        jump: false,
                        size: 4,
                        playerId: "player_1",
                        wormId: "worm_0",
                        metaData: [{type: "clear"}],
                        index: 1
                    },
                    {
                        duration: 0,
                        startX: 479.59384931496,
                        startY: 162.41934809129864,
                        startDirection: 15.039971739254995,
                        speed: 90,
                        turningVelocity: 3,
                        type: "arc",
                        arcCenterX: 461.01153574730796,
                        arcCenterY: 138.86732859246464,
                        arcRadius: 30,
                        arcStartAngle: 13.469175412460098,
                        arcAngleDiff: 0,
                        arcEndAngle: 13.469175412460098,
                        endX: 479.5938493149599,
                        endY: 162.41934809129867,
                        endDirection: 15.039971739254995,
                        startTime: 200,
                        endTime: 200,
                        jump: false,
                        size: 4,
                        playerId: "player_1",
                        wormId: "worm_0",
                        metaData: [],
                        index: 2
                    }
                ]
            }
        });
    });
});