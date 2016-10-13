import * as random from "./../../util/random.js";
var type = "drunk";

var FADE_DURATION = 0.3;

function activate({ strength, duration, wormId }) {
    return {
        timeLeft: duration,
        strength: strength,
        wormId: wormId,
        type: type,
        speedChange: 0,
        speedChangeTimeLeft: 0,
        prevSpeedChange: 0,
        turningVelocityChange: 0
    };
}

function update(gameState, deltaTime, effect) {
    if (effect.speedChangeTimeLeft <= 0) {
        effect.prevSpeedChange = effect.speedChange;
        effect.speedChangeTimeLeft = FADE_DURATION;
        effect.speedChange = random.randInt(gameState, -25, 25); //(random.random(gameState) - 0.5) * deltaTime * 50 - (effect.speedChange * deltaTime * 20);
    }
    effect.speedChangeTimeLeft -= deltaTime;

    effect.turningVelocityChange += (random.random(gameState) - 0.5) * deltaTime * 200 - (effect.turningVelocityChange * deltaTime * 20);
}

function changeSpeed(gameState, effect, speed) {
    var speedChangeDiff = effect.speedChange - effect.prevSpeedChange;
    var speedChange = effect.strength * (effect.prevSpeedChange + speedChangeDiff * (1 - effect.speedChangeTimeLeft / FADE_DURATION));

    var timeActive = effect.duration - effect.timeLeft;
    if (timeActive <= FADE_DURATION) {
        // Being applied.
        return speed + (speedChange * timeActive / FADE_DURATION);
    } else if (effect.timeLeft <= FADE_DURATION) {
        // Fading away.
        return speed + (speedChange * effect.timeLeft / FADE_DURATION);
    }
    return speed + speedChange;
}

function changeTurningVelocity(gameState, effect, turningVelocity) {
    return turningVelocity + effect.strength * effect.turningVelocityChange;
}

export {
    type,
    activate,
    update,
    changeSpeed,
    changeTurningVelocity
};
