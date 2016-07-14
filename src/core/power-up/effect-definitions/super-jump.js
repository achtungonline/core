var TYPE = "superJump";

function activate(gameState, strength, duration, wormId) {
    return {
        timeLeft: duration,
        strength: strength,
        wormId: wormId,
        type: TYPE
    };
}

function changeIsJumping(gameState, effect, wormSpeed) {
    return true;
}

module.exports = {
    type: TYPE,
    activate: activate,
    changeIsJumping: changeIsJumping
};
