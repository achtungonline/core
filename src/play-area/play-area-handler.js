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
    var shapeToGridConverter = ShapeToGridConverter.createShapeToGridConverter();

    function applyShape(playArea, shape, value) {
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
        updateBuffer = updateBuffer.concat(changedData);
        return changedData;
    }

    function getCellValue(playArea, index) {
        return playArea.grid[index];
    }

    function applyWormHead(playArea, worm) {
        return applyShape(playArea, worm.head, worm.id);
    }

    function applyObstacleShape(playArea, shape) {
        return applyShape(playArea, shape, PlayArea.OBSTACLE);
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
        resetUpdateBuffer: resetUpdateBuffer,
        getCellValue: getCellValue
    };
};