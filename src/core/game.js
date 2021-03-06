import * as gameStateFunctions from "./game-state-functions.js";
import * as coreFunctions from "./core-functions.js";

export default function Game(gameState, aiHandler) {
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

        if (gameStateFunctions.isInStartPhase(gameState)) {
            coreFunctions.updatePlayers(gameState, deltaTime);
            coreFunctions.updateWorms(gameState, deltaTime);
        } else {
            coreFunctions.updatePowerUps(gameState, deltaTime);
            coreFunctions.updateEffects(gameState, deltaTime);
            coreFunctions.updatePlayers(gameState, deltaTime);
            coreFunctions.updateWormJumps(gameState, deltaTime);
            coreFunctions.updateWorms(gameState, deltaTime);
            coreFunctions.updateCollision(gameState);
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
