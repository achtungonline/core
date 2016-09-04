var constants = require("./constants");
var gameStateFunctions = require("./game-state-functions.js");
var coreFunctions = require("./core-functions.js");
var jumpHandler = require("./worm/jump-handler.js")();
var random = require("./util/random.js");

module.exports = function Game(gameState, playerHandler, powerUpHandler, aiHandler) {
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
            playerHandler.update(gameState, deltaTime);
            coreFunctions.updateWorms(gameState, deltaTime);
            gameState.startPhaseTimer -= deltaTime;
        } else {
            powerUpHandler.update(deltaTime, gameState);
            coreFunctions.updateEffects(gameState, deltaTime);
            playerHandler.update(gameState, deltaTime);
            jumpHandler.update(gameState, deltaTime);
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
