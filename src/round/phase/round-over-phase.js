var PHASE_DURATION = 3;

var roundOverPhase = module.exports = {};

roundOverPhase.type = "roundOverPhase";

roundOverPhase.RoundOverPhase = function RoundOverPhase() {

    function start(gameState) {
        gameState.phaseTimer = PHASE_DURATION;
    }

    function update(gameState, deltaTime) {
        if (isActive(gameState)) {
            return;
        }
        gameState.phaseruntime -= deltaTime;
    }

    function isActive(gameState) {
        return gameState.phaseTimer > 0;
    }

    return {
        type: roundOverPhase.type,
        start: start,
        update: update,
        isActive: isActive
    };
};
