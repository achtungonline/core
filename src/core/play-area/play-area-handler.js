var shapeToGridConverter = require("./../geometry/shape-to-grid-converter.js").createShapeToGridConverter();
var constants = require("../constants.js");
var gameStateFunctions = require("../game-state-functions.js");

var UpdateBufferData = function UpdateBufferData(index, value) {
    var data = {};
    data.index = index;
    data.value = value;
    return data;
};

module.exports = function PlayAreaHandler() {

    function applyShape(gameState, shape, value) {
        var playArea = gameState.playArea;
        var points = shapeToGridConverter.convert(shape, playArea);
        var grid = playArea.grid;
        var changedData = [];
        for (var i = 0; i < points.length; i++) {
            // Buffer should only be updated when a value has changed
            if (grid[points[i]] !== value) {
                grid[points[i]] = value;
                changedData.push(UpdateBufferData(points[i], value));
            }
        }
        gameState.playAreaUpdateBuffer = gameState.playAreaUpdateBuffer.concat(changedData);
        return changedData;
    }

    function applyWormHead(gameState, worm) {
        return applyShape(gameState, worm.head, worm.id);
    }

    function applyObstacleShape(gameState, shape) {
        return applyShape(gameState, shape, constants.PLAY_AREA_OBSTACLE);
    }

    function resetPlayArea(gameState) {
        gameStateFunctions.resetPlayArea(gameState);
    }

    function resetUpdateBuffer(gameState) {
        gameState.playAreaUpdateBuffer = [];
    }

    return {
        applyWormHead: applyWormHead,
        applyObstacleShape: applyObstacleShape,
        resetPlayArea: resetPlayArea,
        resetUpdateBuffer: resetUpdateBuffer
    };
};