var TYPE = "turningSpeed";

function activate(gameState, strength, duration, wormId) {
    return {
        duration: duration,
        strength: strength,
        wormId: wormId,
        type: TYPE,
        changeSpeed: true
    };
}

function changeTurningSpeed(gameState, effect, turningSpeed) {
    return turningSpeed * effect.strength;
}

module.exports = {
    type: TYPE,
    activate: activate,
    changeTurningSpeed: changeTurningSpeed
};