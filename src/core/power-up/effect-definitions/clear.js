var constants = require("../../constants.js");
var gameStateFunctions = require("../../game-state-functions.js");

var TYPE = "clear";

function activate({ gameState, wormId, affects}) {

    var grid = gameState.playArea.grid;
    for (var i = 0; i < grid.length; i++) {
        if (affects === "all" || affects === "self" && grid[i] === wormId || affects === "others" && grid[i] !== wormId) {
            grid[i] = constants.PLAY_AREA_FREE;
        }
    }

    gameState.worms.forEach(function (worm) {
        if (affects === "all" || affects === "self" && worm.id === wormId || affects === "others" && worm.id !== wormId) {
            gameStateFunctions.addWormPathSegment(gameState, worm.id, {
                type: TYPE,
                startTime: gameState.gameTime,
                endTime: gameState.gameTime
            });
        }
    });
}

module.exports = {
    type: TYPE,
    activate: activate
};
