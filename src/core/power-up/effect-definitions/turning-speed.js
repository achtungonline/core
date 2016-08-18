var TYPE = "turningSpeed";

function activate({ strength, duration, wormId }) {
    return {
        timeLeft: duration,
        strength: strength,
        wormId: wormId,
        type: TYPE
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
