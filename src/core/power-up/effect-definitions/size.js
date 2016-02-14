var TYPE = "size";

function activate(gameState, strength, duration, wormId) {
    return {
        duration: duration,
        strength: strength,
        wormId: wormId,
        type: TYPE
    };
}

function changeSize(gameState, effect, wormSize) {
    return wormSize * effect.strength;
}

module.exports = {
    type: TYPE,
    activate: activate,
    changeSize: changeSize
};