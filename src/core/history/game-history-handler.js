var ROUND_OVER_TYPE = require("../phase/round-over-phase.js").type;

module.exports = function GameHistoryHandler() {

    function recordGameHistory(game, gameHistory) {
        var running = true; //TODO remove, use game.isActive()
        game.on(game.events.GAME_UPDATE_STARTING, function (gameState, deltaTime) {
            if (running) {
                updateGameHistory(gameHistory, gameState, deltaTime);
            }
        });

        game.on(game.events.GAME_OVER, function () {
            console.log("Game history logged " + gameHistory.updates.length + " updates");
            running = false;
        });
    }

    function updateGameHistory(gameHistory, gameState, deltaTime) {
        var newUpdate = {};
        newUpdate.deltaTime = deltaTime;
        newUpdate.steering = [];
        gameState.players.forEach(function AddPlayerSteering(player) {
            newUpdate.steering.push(player.steering);
        });
        gameHistory.updates.push(newUpdate);
    }

    return {
        recordGameHistory: recordGameHistory
    };

};