var playerUtils = require("../../player/player-utils.js");

var WORM_SWITCH_TYPE = "worm_switch";

var me = module.exports = {};

me.type = WORM_SWITCH_TYPE;

me.WormSwitchEffectHandler = function WormSwitchEffectHandler(deps) {

    var random = deps.random;

    function activate(gameState, worm) {
        var aliveWorms = playerUtils.getAliveWorms(gameState.worms);
        var perm = random.randomPermutation(aliveWorms.length, true);
        console.log(perm);
        for (var i = 0; i < perm.length; i++) {
            if (perm[i] !== -1) {
                var index = i;
                var tmp = aliveWorms[index].playerId;
                console.log(tmp);
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
        aliveWorms.forEach(function(worm) {
            worm.trajectory = undefined;
        });
    }

    return {
        activate: activate
    };
};