var TYPE = "size";

var FADE_DURATION = 0.4;

function activate({ strength, duration, wormId }) {
    return {
        duration: duration,
        timeLeft: duration,
        strength: strength,
        wormId: wormId,
        type: TYPE
    };
}

function changeWormRadius(gameState, effect, wormRadius) {
    var timeActive = effect.duration - effect.timeLeft;
    if (timeActive <= FADE_DURATION || effect.timeLeft <= FADE_DURATION) {
        return wormRadius;
    } else {
        return wormRadius * effect.strength;
    }
}

module.exports = {
    type: TYPE,
    activate,
    changeWormRadius
};
