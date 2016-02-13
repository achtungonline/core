var playerUtils = require("../../player/player-utils.js");
var random = require("../../util/random");

var TYPE = "wormSwitch";

function activate(gameState, strength, duration, wormId) {
    var aliveWorms = playerUtils.getAliveWorms(gameState.worms);
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

module.exports = {
    type: TYPE,
    activate: activate
};