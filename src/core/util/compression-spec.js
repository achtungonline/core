import {compressWormSegment, decompressWormSegment} from "./compression";

describe("util", function () {

    var objectsEqual = function(actual, expected) {
        var result = Object.keys(actual).every((key) => {
            var v1 = actual[key], v2 = expected[key];
            if (v1 === v2) {
                return true;
            }
            if (typeof v1 === "number" && typeof v2 === "number") {
                return Math.abs(v1 - v2) < 0.1;
            }
            return false;
        });
        result = result && Object.keys(expected).every((key) => actual[key] !== undefined);
        return result;
    };

    beforeEach(function() {
        jasmine.addCustomEqualityTester(objectsEqual);
    });

    it("test worm path segment compression", function () {
        var pathSegment = {
            arcAngleDiff: -1.4010000000000002,
            arcCenterX: 65.27510907415417,
            arcCenterY: 330.1474044603296,
            arcEndAngle: 3.76138788614945,
            arcRadius: 30,
            arcStartAngle: 5.162387886149453,
            duration: 0.4670000000000003,
            endDirection: 2.1905915593545533,
            endTime: 4.806999999999999,
            endX: 40.85518657371108,
            endY: 312.7213496838647,
            id: "player_0_worm_0",
            index: 12,
            jump: false,
            playerId: "player_0",
            size: 4,
            speed: 90,
            startDirection: 3.591591559354556,
            startTime: 4.339999999999993,
            startX: 78.32404553845481,
            startY: 303.133977111127,
            turningVelocity: -3,
            type: "arc",
            wormId: "worm_0"
        };

        expect(decompressWormSegment(compressWormSegment(pathSegment))).toEqual(pathSegment);
    });
});