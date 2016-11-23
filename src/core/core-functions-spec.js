import * as gsf from "./game-state-functions.js";
import * as cf from "./core-functions.js";

import "phantomjs-polyfill-find/find-polyfill.js";

describe("core-functions", function () {

    describe("createWormPathSegment", function () {


        it("Basic test", function () {
            var gameState = gsf.createGameState({
                gameTime: 10,
                players: [{id: "p1", steering: 0}],
                wormPathSegments: {"p1_w1": [{wormId: "w1"}]},
                worms: [gsf.createWorm(null, {
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
        });

        it("When in start phase, the path segment should not get any length.", function () {
            var gameState = gsf.createGameState({
                gameTime: 10,
                gameActive: true,
                startPhaseTime: 30,
                players: [{id: "p1", steering: 0}],
                wormPathSegments: {"p1_w1": [{wormId: "w1"}]},
                worms: [gsf.createWorm(null, {
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
        });
    });
});