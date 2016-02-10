var EventEmitter = require("events").EventEmitter;

/**
 * Responsible for the different phases during the game.
 *  * A phase is a sort of logical concept within a game round. Such as the starting phase when the worms don't move and the play phase which is when they start moving.
 * Phases: notStartedPhase | startPhase | playPhase | roundOverPhase
 * @param phases
 * @returns {{start: start, update: update, isActive: isActive, on: (*|function(this:(*|EventEmitter))), events: {}}}
 * @constructor
 */

module.exports = function PhaseHandler(phases) {
    var eventEmitter = new EventEmitter();
    var events = {};
    events.NEW_PHASE_STARTED = "newPhaseStarted";
    var currentPhaseIndex = 0;

    function start(gameState) {
        startCurrentPhase(gameState);
    }

    function startCurrentPhase(gameState) {
        getCurrentPhase().start(gameState);
        gameState.phase = getCurrentPhase().type;
        eventEmitter.emit(events.NEW_PHASE_STARTED, getCurrentPhase().type, gameState);
    }

    function startNextPhase(gameState) {
        currentPhaseIndex++;
        startCurrentPhase(gameState);
    }

    function update(gameState, deltaTime) {
        if (!isActive(gameState)) {
            return;
        }
        function isLastPhase() {
            return currentPhaseIndex === phases.length - 1;
        }

        getCurrentPhase().update(gameState, deltaTime);

        if (!getCurrentPhase().isActive(gameState)) {
            if (isLastPhase()) {
                // Do not start a new phase if it is the last
                return;
            }
            startNextPhase(gameState);
        }
    }

    function getCurrentPhase() {
        return phases[currentPhaseIndex];
    }

    function isActive(gameState) {
        return getCurrentPhase().isActive(gameState);
    }

    return {
        start: start,
        update: update,
        isActive: isActive,
        on: eventEmitter.on.bind(eventEmitter),
        events: events
    };
};