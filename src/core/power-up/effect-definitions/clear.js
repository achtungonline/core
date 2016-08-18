var constants = require("./../../constants.js");
var gameStateFunctions = require("../../game-state-functions.js");

var TYPE = "clear";

function activate({ gameState, wormId, affects}) {

    gameStateFunctions.resetPlayArea(gameState);

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
