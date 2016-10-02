var constants = require("../../constants.js");
var gsf = require("../../game-state-functions.js");
var forEach = require("../../util/for-each.js");

var TYPE = "clear";

function activate({ gameState, wormId, affects}) {
    function shouldGetAffected(playerId) {
        return affects === "all" || affects === "self" && playerId === gsf.getPlayer(gameState, wormId).id || affects === "others" && playerId !== gsf.getPlayer(gameState, wormId).id;
    }

    var grid = gameState.playArea.grid;
    for (var i = 0; i < grid.length; i++) {
        if (grid[i] !== -1) {
            if (shouldGetAffected(gsf.getPlayer(gameState, gsf.getPlayer(gameState, grid[i]).id).id)) {
                grid[i] = constants.PLAY_AREA_FREE;
            }
        }
    }

    forEach(gameState.wormPathSegments, function (wormPathSegment, id) {
        if (shouldGetAffected(wormPathSegment[0].playerId)) {
            gsf.addWormPathSegmentMetaData(gameState, id, {
                type: TYPE
            }, true);
        }
    });
}

module.exports = {
    type: TYPE,
    activate: activate
};
