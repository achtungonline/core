var TYPE = "superJump";

function activate(gameState, strength, duration, wormId) {
    return {
        duration: duration,
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