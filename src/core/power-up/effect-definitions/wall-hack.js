import * as random from "../../util/random";
import * as gsf from "../../game-state-functions.js";
import * as trajectoryUtil from "../../geometry/trajectory/trajectory-util.js";
import * as shapeSpatialRelations from "../../geometry/shape-spatial-relations.js";
import * as cc from "../../core-functions.js";

var type = "wallHack";

function activate({ strength, duration, wormId }) {
    return {
        timeLeft: duration,
        strength: strength,
        wormId: wormId,
        type: type
    };
}

function updateWorm(gameState, deltaTime, wormId, pathSegment) {
    var worm = gsf.getWorm(gameState, wormId);
    if (!shapeSpatialRelations.contains(gameState.map.shape, worm)) {
        function getModifiedWallHackSegment({xDiff = 0, yDiff = 0, startDirectionDiff = 0}) {
            var modifiedSegment = gsf.createWormPathSegment(gameState, wormId,
                {
                    duration: pathSegment.duration,
                    centerX: pathSegment.startX + xDiff,
                    centerY: pathSegment.startY + yDiff,
                    direction: pathSegment.startDirection + startDirectionDiff,
                    speed: pathSegment.speed,
                    turningVelocity: pathSegment.turningVelocity,
                    jump: pathSegment.jump,
                    size: pathSegment.size
                });
            modifiedSegment.type = pathSegment.type;
            return modifiedSegment
        }

        var wallHackSegments;
        if (gameState.map.shape.type === "rectangle") {
            var width = gameState.map.shape.width;
            var height = gameState.map.shape.height;
            wallHackSegments = [
                getModifiedWallHackSegment({xDiff: -width}),
                getModifiedWallHackSegment({xDiff: width}),
                getModifiedWallHackSegment({yDiff: -height}),
                getModifiedWallHackSegment({yDiff: height}),
                getModifiedWallHackSegment({xDiff: -width, yDiff: -height}),
                getModifiedWallHackSegment({xDiff: width, yDiff: -height}),
                getModifiedWallHackSegment({xDiff: -width, yDiff: height}),
                getModifiedWallHackSegment({xDiff: width, yDiff: height})
            ];
        } else if (gameState.map.shape.type === "circle") {

            var x1 = gameState.map.shape.centerX - pathSegment.startX;
            var y1 = gameState.map.shape.centerY - pathSegment.startY;
            var r1 = Math.sqrt(Math.pow(x1, 2) + Math.pow(y1, 2));
            var d = gameState.map.shape.radius * 2;
            var centerX = d * x1 / r1 - x1 + gameState.map.shape.centerX;
            var centerY = d * y1 / r1 - y1 + gameState.map.shape.centerY;


            var oldDir = pathSegment.startDirection;
            x1 = pathSegment.startX - gameState.map.shape.centerX;
            y1 = pathSegment.startY - gameState.map.shape.centerY;
            r1 = Math.sqrt(Math.pow(x1, 2) + Math.pow(y1, 2));
            var dir1 = Math.acos(x1 / r1);
            if (y1 < 0) {
                dir1 += (Math.PI - dir1) * 2;
            }
            while (oldDir < 0) {
                oldDir += (2 * Math.PI);
            }
            while (oldDir > 2 * Math.PI) {
                oldDir -= (2 * Math.PI);
            }
            var newDir = oldDir + (dir1 - oldDir) * 2;

            wallHackSegments = [
                getModifiedWallHackSegment({
                    xDiff: centerX - pathSegment.startX,
                    yDiff: centerY - pathSegment.startY,
                    startDirectionDiff: newDir - pathSegment.startDirection
                })
            ];
        } else {
            throw "Unhandled map type for wall hack: " + gameState.map.shape.type;
        }

        var secondaryId = 1;
        wallHackSegments.forEach(function (segment) {
            if (shapeSpatialRelations.intersects(gameState.map.shape, {centerX: segment.endX, centerY: segment.endY, radius: segment.size})) {
                var segmentId = worm.playerId + "_" + wormId + "#" + secondaryId;
                segment.id = segmentId;
                secondaryId++;

                //  TODO: Will get removed when we no longer have collision detection based on playArea
                if (pathSegment.speed > 0 && !pathSegment.jump) {
                    //TODO Rename addPlayAreaWormHead
                    gsf.addPlayAreaShape(gameState, {centerX: segment.startX, centerY: segment.startY, radius: segment.size}, segmentId).forEach(function (cell) {
                        worm.distanceTravelledFromCells[cell.index] = worm.distanceTravelled;
                    });
                }
                gsf.addWormPathSegment(gameState, segment);
            }
        });

        if (!shapeSpatialRelations.intersects(gameState.map.shape, worm)) {
            // Main worm segment is outside of map, switch with one of the wallHackSegments, that should be fully inside the map
            var wallHackSegmentInsideMap = wallHackSegments.find(segment => shapeSpatialRelations.contains(gameState.map.shape, {centerX: segment.endX, centerY: segment.endY, radius: segment.size}));
            if (!wallHackSegmentInsideMap) {
                wallHackSegmentInsideMap = wallHackSegments.find(segment => shapeSpatialRelations.intersects(gameState.map.shape, {centerX: segment.endX, centerY: segment.endY, radius: segment.size}));
            }
            worm.direction = wallHackSegmentInsideMap.startDirection;
            worm.centerX = wallHackSegmentInsideMap.endX;
            worm.centerY = wallHackSegmentInsideMap.endY;
        }
    }
}

export {
    type,
    updateWorm,
    activate
};
