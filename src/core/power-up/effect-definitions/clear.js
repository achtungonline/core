import * as constants from "../../constants.js";
import * as gsf from "../../game-state-functions.js";
import forEach from "../../util/for-each.js";

var type = "clear";

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
            var wps = gsf.createWormPathSegment(gameState, gsf.getLatestWormPathSegment(gameState, id).wormId);
            wps.type = "clear";
            gsf.addWormPathSegment(gameState, wps);
        }
    });
}

export {
    type,
    activate
};
