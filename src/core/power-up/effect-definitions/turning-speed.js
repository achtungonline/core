var type = "turningSpeed";

function activate({ strength, duration, wormId }) {
    return {
        timeLeft: duration,
        strength: strength,
        wormId: wormId,
        type: type
    };
}

function changeTurningSpeed(gameState, effect, turningSpeed) {
    return turningSpeed * effect.strength;
}

export {
    type,
    activate,
    changeTurningSpeed
};
