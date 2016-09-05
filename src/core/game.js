var constants = require("./constants");
var gameStateFunctions = require("./game-state-functions.js");
var coreFunctions = require("./core-functions.js");
var random = require("./util/random.js");

module.exports = function Game(gameState, aiHandler) {
    function start() {
        gameState.gameActive = true;
    }

    function stop() {
        gameState.gameActive = false;
    }

    function update(deltaTime) {
        if (!isActive(gameState) || deltaTime <= 0) {
            return;
        }
        gameState.gameTime += deltaTime;
        aiHandler.update(gameState, deltaTime);

        if (gameState.startPhaseTimer > 0) {
            coreFunctions.updatePlayers(gameState, deltaTime);
            coreFunctions.updateWorms(gameState, deltaTime);
            gameState.startPhaseTimer -= deltaTime;
        } else {
            coreFunctions.updatePowerUps(gameState, deltaTime);
            coreFunctions.updateEffects(gameState, deltaTime);
            coreFunctions.updatePlayers(gameState, deltaTime);
            coreFunctions.updateWormJumps(gameState, deltaTime);
            coreFunctions.updateWorms(gameState, deltaTime);
        }

        if (gameStateFunctions.getAlivePlayers(gameState).length <= 1) {
            stop(gameState);
        }
    }

    function isActive() {
        return gameState.gameActive;
    }

    return {
        gameState,
        start,
        stop,
        isActive,
        update
    };
};
