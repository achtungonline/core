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
        function getModifiedWallHackSegment({xDiff = 0, yDiff = 0}) {
            var wallHackPathSegment = trajectoryUtil.createTrajectory({
                duration: pathSegment.duration,
                startX: pathSegment.startX + xDiff,
                startY: pathSegment.startY + yDiff,
                startDirection: pathSegment.startDirection,
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
        if(gameState.map.shape.type === "rectangle") {
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
        } else if(gameState.map.shape.type === "circle") {
            console.log("Circle not yet implemented! Nothing will happen");
            return
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
