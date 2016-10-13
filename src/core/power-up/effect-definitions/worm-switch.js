import * as gameStateFunctions from "../../game-state-functions.js";
import * as random from "../../util/random";

var type = "wormSwitch";

function activate({ gameState }) {
    var aliveWorms = gameStateFunctions.getAliveWorms(gameState);
    var perm = random.randomPermutation(gameState, aliveWorms.length, true); //TODO must fix random here (ML)
    for (var i = 0; i < perm.length; i++) {
        if (perm[i] !== -1) {
            var index = i;
            var tmp = aliveWorms[index].playerId;
            while (perm[index] !== i) {
                aliveWorms[index].playerId = aliveWorms[perm[index]].playerId;
                var newIndex = perm[index];
                perm[index] = -1;
                index = newIndex;
            }
            perm[index] = -1;
            aliveWorms[index].playerId = tmp;
        }
    }
    // Need to remove existing trajectories added by the ai. Should find a nicer solution for trajectories
    aliveWorms.forEach(function (worm) {
        worm.trajectory = undefined;
    });
}

export {
    type,
    activate
};
