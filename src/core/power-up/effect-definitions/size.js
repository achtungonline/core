var TYPE = "size";

var FADE_DURATION = 0.4;

function activate(gameState, strength, duration, wormId) {
    return {
        duration: duration,
        timeLeft: duration,
        strength: strength,
        wormId: wormId,
        type: TYPE
    };
}

function changeSize(gameState, effect, wormSize) {
    var timeActive = effect.duration - effect.timeLeft;

    if (timeActive <= FADE_DURATION) {
        // Being applied.
        return wormSize * (1 + ((effect.strength - 1) * timeActive / FADE_DURATION));
    } else if (effect.timeLeft <= FADE_DURATION) {
        // Fading away.
        return wormSize * (1 + ((effect.strength - 1) * effect.timeLeft / FADE_DURATION));
    }

    return wormSize * effect.strength;
}

module.exports = {
    type: TYPE,
    activate: activate,
    changeSize: changeSize
};
