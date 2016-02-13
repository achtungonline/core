var TYPE = "speed";

function activate(gameState, strength, duration, wormId) {
    return {
        duration: duration,
        strength: strength,
        wormId: wormId,
        type: TYPE,
        changeSpeed: true
    };
}

function changeSpeed(gameState, effect, wormSpeed) {
    return wormSpeed + wormSpeed * (0.5 * effect.strength);
}

module.exports = {
    type: TYPE,
    activate: activate,
    changeSpeed
};