var random = require("./../../util/random.js");
var TYPE = "drunk";

function activate(gameState, strength, duration, wormId) {
    return {
        duration: duration,
        strength: strength,
        wormId: wormId,
        type: TYPE,
        speedChange: 0,
        turningVelocityChange: 0
    };
}

function update(gameState, deltaTime, effect) {
    effect.speedChange += (random.random(gameState) - 0.5) * deltaTime * 800 - (effect.speedChange * deltaTime * 20);
    effect.turningVelocityChange += (random.random(gameState) -0.5) * deltaTime * 200 - (effect.turningVelocityChange * deltaTime * 20);
}

function changeSpeed(gameState, effect, speed) {
    return speed + effect.strength * effect.speedChange;
}

function changeTurningVelocity(gameState, effect, turningVelocity) {
    return turningVelocity + effect.strength * effect.turningVelocityChange;
}

module.exports = {
    type: TYPE,
    activate: activate,
    update: update,
    changeSpeed: changeSpeed,
    changeTurningVelocity: changeTurningVelocity
};