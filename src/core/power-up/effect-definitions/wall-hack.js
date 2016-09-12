var random = require("../../util/random");
var gameStateFunctions = require("../../game-state-functions.js");
var trajectoryUtil = require("../../geometry/trajectory/trajectory-util.js");
var shapeSpatialRelations = require("../../geometry/shape-spatial-relations.js");

var TYPE = "wallHack";

function activate({ strength, duration, wormId }) {
    return {
        timeLeft: duration,
        strength: strength,
        wormId: wormId,
        type: TYPE
    };
}

function updateWorm(gameState, deltaTime, wormId, pathSegment) {
    var worm = gameStateFunctions.getWorm(gameState, wormId);
    if (!shapeSpatialRelations.contains(gameState.map.shape, worm)) {
        function getModifiedWallHackSegment({xDiff = 0, yDiff = 0, startDirectionDiff = 0}) {
            var wallHackPathSegment = trajectoryUtil.createTrajectory({
                duration: pathSegment.duration,
                startX: pathSegment.startX + xDiff,
                startY: pathSegment.startY + yDiff,
                startDirection: pathSegment.startDirection + startDirectionDiff,
                speed: pathSegment.speed,
                turningVelocity: pathSegment.turningVelocity
            });
            wallHackPathSegment.startTime = pathSegment.startTime;
            wallHackPathSegment.endTime = pathSegment.endTime;
            wallHackPathSegment.jump = pathSegment.jump;
            wallHackPathSegment.size = pathSegment.size;
            wallHackPathSegment.playerId = pathSegment.playerId;
            wallHackPathSegment.wormId = pathSegment.wormId;
            return wallHackPathSegment
        }

        var wallHackSegments;
        if (gameState.map.shape.type === "rectangle") {
            wallHackSegments = [{
                id: worm.id + "_left",
                segment: getModifiedWallHackSegment({xDiff: -gameState.map.width})
            }, {
                id: worm.id + "_right",
                segment: getModifiedWallHackSegment({xDiff: gameState.map.width})
            }, {
                id: worm.id + "_up",
                segment: getModifiedWallHackSegment({yDiff: -gameState.map.height})
            }, {
                id: worm.id + "_down",
                segment: getModifiedWallHackSegment({yDiff: gameState.map.height})
            }, {
                id: worm.id + "_up_left",
                segment: getModifiedWallHackSegment({xDiff: -gameState.map.width, yDiff: -gameState.map.height})
            }, {
                id: worm.id + "_up_right",
                segment: getModifiedWallHackSegment({xDiff: gameState.map.width, yDiff: -gameState.map.height})
            }, {
                id: worm.id + "_down_left",
                segment: getModifiedWallHackSegment({xDiff: -gameState.map.width, yDiff: gameState.map.height})
            }, {
                id: worm.id + "_down_right",
                segment: getModifiedWallHackSegment({xDiff: gameState.map.width, yDiff: gameState.map.height})
            }];
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
            console.log("oldDir: ", oldDir);
            console.log("newDir: ", newDir);

            wallHackSegments = [{
                id: worm.id + "_mirror",
                segment: getModifiedWallHackSegment({
                    xDiff: centerX - pathSegment.startX,
                    yDiff: centerY - pathSegment.startY,
                    startDirectionDiff: newDir - pathSegment.startDirection
                })
            }];
        } else {
            throw "Unhandled map type for wall hack: " + gameState.map.shape.type;
        }

        wallHackSegments.forEach(function ({id, segment}) {
            if (shapeSpatialRelations.intersects(gameState.map.shape, {centerX: segment.endX, centerY: segment.endY, radius: segment.size})) {
                if (!gameState.wormPathSegments[id]) {
                    gameState.wormPathSegments[id] = [];
                }

                //  TODO: Will get removed when we no longer have collision detection based on playArea
                if (pathSegment.speed > 0 && !pathSegment.jump) {
                    //TODO Rename addPlayAreaWormHead
                    gameStateFunctions.addPlayAreaShape(gameState, {centerX: segment.startX, centerY: segment.startY, radius: segment.size}, pathSegment.wormId).forEach(function (cell) {
                        worm.distanceTravelledFromCells[cell.index] = worm.distanceTravelled;
                    });
                }
                gameStateFunctions.addWormPathSegment(gameState, id, segment);
            }
        });

        if (!shapeSpatialRelations.intersects(gameState.map.shape, worm)) {
            // Main worm segment is outside of map, switch with one of the wallHackSegments, that should be fully inside the map
            var wallHackSegmentInsideMap = wallHackSegments.find(({id, segment}) => shapeSpatialRelations.contains(gameState.map.shape, {centerX: segment.endX, centerY: segment.endY, radius: segment.size})) ||
                    // Could be that it is not yet counted as inside the map, we instead take some wallHackSegment that intersects with the map at least.
                wallHackSegments.find(({id, segment}) => shapeSpatialRelations.intersects(gameState.map.shape, {centerX: segment.endX, centerY: segment.endY, radius: segment.size}));
            if (!wallHackSegmentInsideMap) {
                throw "Could not find a wallhack segment that either contains within the map or at least intersects. Check code.";
            }
            var latestWormPathSegment = gameStateFunctions.getLatestWormPathSegment(gameState, wormId);
            var latestMirrorWormPathSegment = gameStateFunctions.getLatestWormPathSegment(gameState, wallHackSegmentInsideMap.id);
            gameStateFunctions.addWormPathSegment(gameState, worm.id, latestMirrorWormPathSegment);
            gameStateFunctions.addWormPathSegment(gameState, wallHackSegmentInsideMap.id, latestWormPathSegment);

            worm.direction = latestMirrorWormPathSegment.startDirection;
            worm.centerX = latestMirrorWormPathSegment.endX;
            worm.centerY = latestMirrorWormPathSegment.endY;
        }
    }
}

module.exports = {
    type: TYPE,
    updateWorm,
    activate
};
