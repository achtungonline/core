var gameStateFunctions = require("./../game-state-functions.js");
var jumpHandler = require("../worm/jump-handler.js")();

var playPhase = module.exports = {};

playPhase.type = "playPhase";

playPhase.PlayPhase = function PlayPhase({powerUpHandler, effectHandler, playerHandler, wormHandler}) {

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
        gameStateFunctions.forEachAliveWorm(gameState, function (worm) {
            wormHandler.update(gameState, deltaTime, worm);
        });

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


