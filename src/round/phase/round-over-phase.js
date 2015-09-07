var PHASE_DURATION = 3;

var roundOverPhase = module.exports = {};

roundOverPhase.type = "roundOverPhase";

roundOverPhase.RoundOverPhase = function RoundOverPhase() {
    var type = roundOverPhase.type;
    var runtime;

    function start() {
        runtime = PHASE_DURATION;
    }

    function update(deltaTime) {
        if (isRunning()) {
            return;
        }
        runtime -= deltaTime;
        if (runtime < 0) {
            runtime = false;
        }
    }

    function isRunning() {
        return (runtime !== undefined && runtime > 0);
    }


    return {
        type: type,
        start: start,
        update: update,
        isRunning: isRunning
    };
};
