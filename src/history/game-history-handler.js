var ROUND_OVER_TYPE = require("../round/phase/round-over-phase.js").type;

module.exports = function GameHistoryHandler() {

    function recordGameHistory(game, gameHistory) {
        var running = true;
        game.on(game.events.GAME_UPDATE_STARTING, function (gameState, deltaTime) {
            if (running) {
                updateGameHistory(gameHistory, gameState, deltaTime);
            }
        });

        game.on("newPhaseStarted", function (phaseType) {
            if (phaseType === ROUND_OVER_TYPE) {
                console.log("Game history logged " + gameHistory.updates.length + " updates");
                running = false;
            }
        });
    }

    function replayGameHistory(game, gameHistory) {
        var updateIndex = 0;
        game.on(game.events.GAME_UPDATE_STARTING, function (gameState, deltaTime) {
            if (updateIndex < gameHistory.updates.length) {
                applyUpdate(gameState, gameHistory.updates[updateIndex]);
                updateIndex++;
            }
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

    function applyUpdate(gameState, update) {
        update.steering.forEach(function ApplySteering(steering, index) {
            gameState.players[index].steering = steering;
        });
    }

    return {
        recordGameHistory: recordGameHistory,
        replayGameHistory: replayGameHistory
    };

};