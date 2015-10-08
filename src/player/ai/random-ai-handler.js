var UPDATE_TICKS = 30;
var TYPE = "randomAi";

var playerUtils = require("../../player/player-utils.js");

module.exports = function RandomAI(game, random) {

    function update(gameState, deltaTime, player) {
        if(player.aiData.updateTicks === undefined) {
            player.aiData.updateTicks = UPDATE_TICKS;
        }
        player.aiData.updateTicks += 1;
        if (player.aiData.updateTicks >= UPDATE_TICKS) {
            game.setPlayerSteering(player, random.randInt(-1, 2));
            player.aiData.updateTicks = 0;
        }
        playerUtils.forEachAliveWorm(gameState.worms, function (worm) {
            worm.trajectory = [{steering: player.steering, time: 1}];
        }, player.id);
    }

    return {
        update: update,
        type: TYPE
    };
};