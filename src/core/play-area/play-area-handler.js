var shapeToGridConverter = require("./../geometry/shape-to-grid-converter.js").createShapeToGridConverter();
var constants = require("../constants.js");

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
        return changedData;
    }

    function applyWormHead(gameState, worm) {
        return applyShape(gameState, worm.head, worm.id);
    }

    function applyObstacleShape(gameState, shape) {
        return applyShape(gameState, shape, constants.PLAY_AREA_OBSTACLE);
    }

    return {
        applyWormHead: applyWormHead,
        applyObstacleShape: applyObstacleShape
    };
};