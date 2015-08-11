var PlayArea = require("./play-area.js");

module.exports = function PlayAreaHandler() {

    var updateBuffer = [];

    function coordinatesToIndex(playArea, row, column) {
        return row*playArea.width + column;
    }

    function applyShape(playArea, shape, value) {

    }

    function applyWormHead(playArea, worm) {

    }

    function applyObstacleShape(playArea, shape) {
        applyShape(playArea, shape, PlayArea.OBSTACLE);
    }

    function resetPlayArea(playArea) {

    }

    return {
        applyWormHead: applyWormHead,
        applyObstacleShape: applyObstacleShape,
        resetPlayArea: resetPlayArea
    };

};