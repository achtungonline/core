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

    var updateBuffer = [];

    function applyShape(playArea, shape, value) {
        var points = ShapeToGridConverter().convert(shape, playArea);
        var grid = playArea.grid;
        for (var i = 0; i < points.length; i++) {
            // Buffer should only be updated when a value has changed
            if (grid[points[i]] !== value) {
                grid[points[i]] = value;
                updateBuffer.push(UpdateBufferData(points[i], value));
            }
        }
    }

    function applyWormHead(playArea, worm) {
        applyShape(playArea, worm.head, worm.id);
    }

    function applyObstacleShape(playArea, shape) {
        applyShape(playArea, shape, PlayArea.OBSTACLE);
    }

    function resetPlayArea(playArea) {
        GridUtils.fillGrid(playArea.grid, PlayArea.FREE);
    }

    function getUpdateBuffer() {
        return updateBuffer.slice();
    }

    function resetUpdateBuffer() {
        updateBuffer = [];
    }

    return {
        applyWormHead: applyWormHead,
        applyObstacleShape: applyObstacleShape,
        resetPlayArea: resetPlayArea,
        getUpdateBuffer: getUpdateBuffer,
        resetUpdateBuffer: resetUpdateBuffer
    };
};