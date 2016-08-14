var UPDATE_TICKS = 30;
var TYPE = "randomAi";
var random = require("../core/util/random.js");
var gameStateFunctions = require("../core/game-state-functions.js");

module.exports = function RandomAI(game) {
    var seedState = {seed: 10}; //TODO: Local state. AI needs its own "state" with a seed. In order to not affect the core seed

    function update(gameState, deltaTime, player) {
        if (player.aiData.updateTicks === undefined) {
            player.aiData.updateTicks = UPDATE_TICKS;
        }
        player.aiData.updateTicks += 1;
        if (player.aiData.updateTicks >= UPDATE_TICKS) {
            game.setPlayerSteering(player.id, random.randInt(seedState, -1, 2));
            player.aiData.updateTicks = 0;
        }
        gameStateFunctions.forEachAliveWorm(gameState, function (worm) {
            worm.trajectory = [{steering: player.steering, time: 1}];
        }, player.id);
    }

    return {
        update: update,
        type: TYPE
    };
};
