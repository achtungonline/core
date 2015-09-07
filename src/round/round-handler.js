var EventEmitter = require("events").EventEmitter;

/**
 * Responsible for a game round.
 * @param phases
 * @returns {{start: start, update: update, isRunning: isRunning, on: (*|function(this:(*|EventEmitter))), events: {}}}
 * @constructor
 */
module.exports = function RoundHandler(phases) {
    var eventEmitter = new EventEmitter();
    var events = {};
    events.NEW_PHASE_STARTED = "newPhaseStarted";

    var currentPhaseIndex = 0;

    function start(gameState) {
        startCurrentPhase(gameState);
    }

    function startCurrentPhase(gameState) {
        getCurrentPhase().start(gameState);
        eventEmitter.emit(events.NEW_PHASE_STARTED, getCurrentPhase().type);
    }

    function startNextPhase(gameState) {
        currentPhaseIndex++;
        startCurrentPhase(gameState);
    }

    function update(gameState, deltaTime) {
        if (!isRunning()) {
            return;
        }
        function isLastPhase() {
            return currentPhaseIndex === phases.length - 1;
        }

        getCurrentPhase().update(gameState, deltaTime);

        if (!getCurrentPhase().isRunning()) {
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

    function isRunning() {
        return getCurrentPhase().isRunning();
    }

    return {
        start: start,
        update: update,
        isRunning: isRunning,
        on: eventEmitter.on.bind(eventEmitter),
        events: events
    };
};