var PlayArea = require("./play-area.js");
var playAreaUtils = require("./../grid/grid-utils.js");
var ShapeToGridConverter = require("./../geometry/shape-to-grid-converter.js");

module.exports = function PlayAreaHandler() {

    var updateBuffer = [];

    var updateBufferData = function() {

    };


    function applyShape(playArea, shape, value) {
        var points = ShapeToGridConverter().convert(shape, playArea);
        for (var i = 0; i < points.length; i++) {
            playArea[points[i]] = value;
            updateBuffer.push()
        }
    }

    function applyWormHead(playArea, worm) {
        applyShape(playArea, worm.head, 1);

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