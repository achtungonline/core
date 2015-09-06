var PlayArea = require("./play-area.js");
var GridUtils = require("./../grid/grid-utils.js");
var ShapeToGridConverter = require("./../geometry/shape-to-grid-converter.js");

var UpdateBufferData = function UpdateBufferData(index, value) {
    var data = {};
    data.index = index;
    data.value = value;
    return data;
};

module.exports = function PlayAreaHandler() {

    var shapeToGridConverter = ShapeToGridConverter.createShapeToGridConverter();

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
        return applyShape(gameState, shape, PlayArea.OBSTACLE);
    }

    function resetPlayArea(gameState) {
        GridUtils.fillGrid(gameState.playArea.grid, PlayArea.FREE);
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