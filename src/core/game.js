var StartPhase = require("./phase/start-phase.js").StartPhase;
var PlayPhase = require("./phase/play-phase.js").PlayPhase;
var RoundOverPhase = require("./phase/round-over-phase.js").RoundOverPhase;

module.exports = function Game(gameState, playerHandler, powerUpHandler, effectHandler, aiHandler) {
    var currentPhaseIndex = 0;

    var phases = [
        StartPhase({
            playerHandler
        }),
        PlayPhase({
            playerHandler,
            powerUpHandler,
            effectHandler
        }),
        RoundOverPhase()
    ];

    function start() {
        gameState.gameActive = true;
        phases[currentPhaseIndex].start(gameState);
        gameState.phase = phases[currentPhaseIndex].type;
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

        var currentPhase = phases[currentPhaseIndex];
        currentPhase.update(gameState, deltaTime);

        if (!currentPhase.isActive(gameState)) {
            if (currentPhaseIndex !== phases.length - 1) {
                currentPhaseIndex++;
                var nextPhase = phases[currentPhaseIndex];
                nextPhase.start(gameState);
                gameState.phase = nextPhase.type;
            }
        }

        if(gameState.phase === "roundOverPhase") {
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
