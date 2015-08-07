module.exports = function RoundHandler(eventHandler, phases) {
    var currentPhaseIndex = 0;
    var run;
    eventHandler.register(eventHandler.events.GAME_ROUND_PHASE_STARTED);

    function start(players, map) {
        startCurrentPhase(players, map);
    }

    function startCurrentPhase(players, map) {
        getCurrentPhase().start(players, map);
        eventHandler.emit(eventHandler.events.GAME_ROUND_PHASE_STARTED, getCurrentPhase().type);
    }

    function startNextPhase() {
        currentPhaseIndex++;
        startCurrentPhase();
    }

    function update(deltaTime, players, map) {
        if (!isRunning()) {
            return;
        }

        getCurrentPhase().update(deltaTime, players, map);

        if (!getCurrentPhase().isRunning()) {
            function isLastPhase() {
                return currentPhaseIndex === phases.length - 1
            }

            if (isLastPhase()) {
                // Do not start a new phase if it is the last
                return;
            }
            startNextPhase();
        }
    }

    function getCurrentPhase() {
        return phases[currentPhaseIndex];
    }

    function isRunning() {
        return getCurrentPhase().isRunning();
    }

    return {
        start: start,
        update: update,
        isRunning: isRunning
    }
}