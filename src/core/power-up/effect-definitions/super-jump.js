var type = "superJump";

function activate({ strength, duration, wormId }) {
    return {
        timeLeft: duration,
        strength: strength,
        wormId: wormId,
        type
    };
}

function changeIsJumping(gameState, effect, wormSpeed) {
    return true;
}

export {
    type,
    activate,
    changeIsJumping
};
