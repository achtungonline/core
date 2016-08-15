var constants = require("./../../constants.js");
var shapeToGridConverter = require("./../../geometry/shape-to-grid-converter.js").createShapeToGridConverter();
var shapeFactory = require("./../../geometry/shape-factory.js");

var TYPE = "clear";

function activate(gameState, strength, duration, wormId) {
    var UpdateBufferData = function UpdateBufferData(index, value) { //TODO: STOLEN from play-area-handler
        var data = {};
        data.index = index;
        data.value = value;
        return data;
    };

    function applyShape(gameState, shape, value) { //TODO: STOLEN from play-area-handler
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

    applyShape(gameState, rectangle.Rectangle(gameState.map.width, gameState.map.height, 0, 0), constants.PLAY_AREA_FREE);

    gameState.worms.forEach(function (worm) {
        gameState.wormPathSegments[worm.id].push({
            type: TYPE,
            startTime: gameState.gameTime,
            endTime: gameState.gameTime
        });
    });
}

module.exports = {
    type: TYPE,
    activate: activate
};
