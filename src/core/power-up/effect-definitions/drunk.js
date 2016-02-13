var random = require("./../../util/random.js");
var TYPE = "drunk";

function activate(gameState, strength, duration, wormId) {
    return {
        duration: duration,
        strength: strength,
        wormId: wormId,
        type: TYPE,
        speedChange: 0,
        directionChange: 0
    };
}

function update(gameState, deltaTime, effect) {
    effect.speedChange += (random.random(gameState) - 0.5) * deltaTime * 500;
    effect.directionChange = (random.random(gameState) -0.5) * deltaTime * 50;
}

function changeSpeed(gameState, effect, speed) {
    return speed + effect.strength * effect.speedChange;
}

function changeDirection(gameState, effect, direction) {
    return direction + effect.strength * effect.directionChange;
}

module.exports = {
    type: TYPE,
    activate: activate,
    update: update,
    changeSpeed: changeSpeed,
    changeDirection: changeDirection
};