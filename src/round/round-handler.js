var EventEmitter = require("events").EventEmitter;

module.exports = function RoundHandler(phases) {
    var eventEmitter = new EventEmitter();
    var events = {};
    events.NEW_PHASE_STARTED = "newPhaseStarted";

    var currentPhaseIndex = 0;

    function start(players, map) {
        startCurrentPhase(players, map);
    }

    function startCurrentPhase(players, map) {
        getCurrentPhase().start(players, map);
        eventEmitter.emit(events.NEW_PHASE_STARTED, getCurrentPhase().type);
    }

    function startNextPhase(players, map) {
        currentPhaseIndex++;
        startCurrentPhase(players, map);
    }

    function endCurrentPhase(players, map) {
        getCurrentPhase().end(players, map);
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
            endCurrentPhase(players, map);
            startNextPhase(players, map);
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
    }
};