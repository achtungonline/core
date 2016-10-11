var gsf = require("./game-state-functions.js");
var cf = require("./core-functions.js");

require("phantomjs-polyfill-find/find-polyfill.js");

describe("core-functions", function () {

    it("addWormPathSegment", function () {
        var gameState = gsf.createGameState({
            gameTime: 10, players: [{id: "p1", steering: 0}], worms: [gsf.createWorm({
                id: "w1",
                playerId: "p1",
                direction: 50,
                speed: 60,
                centerX: 10,
                centerY: 20,
                radius: 2
            })]
        });
        expect(cf.createWormPathSegment(gameState, "w1", {duration: 1})).toEqual({
            duration: 1,
            startX: 10,
            startY: 20,
            endX: 67.8979617095268,
            endY: 4.257508777764274,
            startDirection: 50,
            endDirection: 50,
            speed: 60,
            turningVelocity: 0,
            type: "straight",
            startTime: 9,
            endTime: 10,
            jump: false,
            size: 2,
            playerId: "p1",
            wormId: "w1",
            id: "p1_w1"
        });

        gameState.gameActive = true;
        gameState.startPhaseTimer = 1;

        expect(cf.createWormPathSegment(gameState, "w1", {duration: 1})).toEqual({
            duration: 1,
            startX: 10,
            startY: 20,
            endX: 10,
            endY: 20,
            startDirection: 50,
            endDirection: 50,
            speed: 0,
            turningVelocity: 0,
            type: "still_arc",
            startTime: 9,
            endTime: 10,
            jump: false,
            size: 2,
            playerId: "p1",
            wormId: "w1",
            id: "p1_w1"
        });

        expect(cf.createWormPathSegment(gameState, "w1", {duration: 0, type: "worm_died"})).toEqual({
            duration: 0,
            startX: 10,
            startY: 20,
            endX: 10,
            endY: 20,
            startDirection: 50,
            endDirection: 50,
            speed: 0,
            turningVelocity: 0,
            type: "worm_died",
            startTime: 10,
            endTime: 10,
            jump: false,
            size: 2,
            playerId: "p1",
            wormId: "w1",
            id: "p1_w1"
        });
    });
});