var TYPE = "speed";

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

function changeSpeed(gameState, effect, wormSpeed) {
    var timeActive = effect.duration - effect.timeLeft;

    if (timeActive <= FADE_DURATION) {
        // Being applied.
        return wormSpeed * (1 + ((effect.strength - 1) * timeActive / FADE_DURATION));
    } else if (effect.timeLeft <= FADE_DURATION) {
        // Fading away.
        return wormSpeed * (1 + ((effect.strength - 1) * effect.timeLeft / FADE_DURATION));
    }

    return wormSpeed * effect.strength;
}

module.exports = {
    type: TYPE,
    activate: activate,
    changeSpeed: changeSpeed
};
