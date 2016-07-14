var TYPE = "speed";

function activate(gameState, strength, duration, wormId) {
    return {
        timeLeft: duration,
        strength: strength,
        wormId: wormId,
        type: TYPE
    };
}

function changeSpeed(gameState, effect, wormSpeed) {
    return wormSpeed * effect.strength;
}

module.exports = {
    type: TYPE,
    activate: activate,
    changeSpeed: changeSpeed
};
