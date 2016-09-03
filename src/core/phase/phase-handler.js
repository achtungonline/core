var StartPhase = require("./start-phase.js").StartPhase;
var PlayPhase = require("./play-phase.js").PlayPhase;
var RoundOverPhase = require("./round-over-phase.js").RoundOverPhase;

module.exports = function PhaseHandler({playerHandler, powerUpHandler, effectHandler}) {
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

    function start(gameState) {
        phases[currentPhaseIndex].start(gameState);
        gameState.phase = phases[currentPhaseIndex].type;
    }

    function update(gameState, deltaTime) {
        if (!isActive(gameState)) {
            return;
        }

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
    }

    function isActive(gameState) {
        return phases[currentPhaseIndex].isActive(gameState);
    }

    return {
        start: start,
        update: update,
        isActive: isActive
    };
};