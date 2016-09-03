var gameStateFunctions = require("./../game-state-functions.js");
var coreFunctions = require("./../core-functions.js");
var jumpHandler = require("../worm/jump-handler.js")();

var playPhase = module.exports = {};

playPhase.type = "playPhase";

playPhase.PlayPhase = function PlayPhase({powerUpHandler, effectHandler, playerHandler}) {

    function start(gameState) {
        gameState.phaseTimer = 1;
    }

    function update(gameState, deltaTime) {
        if (!isActive(gameState)) {
            return;
        }

        powerUpHandler.update(deltaTime, gameState);
        effectHandler.update(deltaTime, gameState);
        playerHandler.update(gameState, deltaTime);
        jumpHandler.update(gameState, deltaTime);
        coreFunctions.updateWorms(gameState, deltaTime);

        var alivePlayers = gameStateFunctions.getAlivePlayers(gameState);
        if (alivePlayers.length <= 1) {
            gameState.phaseTimer = -1;
        }
    }

    function isActive(gameState) {
        return gameState.phaseTimer > 0;
    }

    return {
        type: playPhase.type,
        start: start,
        update: update,
        isActive: isActive
    };
};


