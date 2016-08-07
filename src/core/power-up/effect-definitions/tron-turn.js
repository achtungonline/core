var gameStateFunctions = require("./../../game-state-functions.js");
var TYPE = "tronTurn";
var MIN_REACTION_TIME = 0.1;

function activate(gameState, strength, duration, wormId) {
    return {
        timeLeft: duration,
        wormId: wormId,
        type: TYPE
    };
}

function update(gameState, deltaTime, effect) {
    var player = gameStateFunctions.getPlayer(gameState, effect.wormId);
    var tronTurnEffects = gameStateFunctions.getWormEffects(gameState, effect.wormId, TYPE);
    if (tronTurnEffects.filter(e => e.timeLeft > effect.timeLeft).length > 0) {
        // Only one tronTurn is allowed to update data, and makes sure all other tronTurn for this player has the same data (for when this timer runs out)
        return;
    }

    if (!effect.lastTronTurnGameTime) {
        effect.lastTronTurnGameTime = 0;
        effect.prevSteering = 0;
        effect.steeringHasChanged = true;
    }

    if (effect.prevSteering !== player.steering) {
        effect.steeringHasChanged = true;
    }

    if (gameState.gameTime - effect.lastTronTurnGameTime >= MIN_REACTION_TIME) {
        // Allowed to make a new tron turn
        if (player.steering !== 0 && effect.steeringHasChanged) {
            effect.turningVelocity = player.steering * (Math.PI / 2) / deltaTime;
            effect.lastTronTurnGameTime = gameState.gameTime;
            effect.prevSteering = player.steering;
            effect.steeringHasChanged = false;
        } else {
            effect.turningVelocity = 0;
        }
    } else {
        effect.turningVelocity = 0;
    }

    tronTurnEffects.forEach(function (e) {
        e.lastTronTurnGameTime = effect.lastTronTurnGameTime;
        e.prevSteering = effect.prevSteering;
        e.steeringHasChanged = effect.steeringHasChanged;
        e.turningVelocity = effect.turningVelocity;
    });
}

function getWormTurningVelocity(gameState, effect, deltaTime) {
    if (effect.turningVelocity) {
        return effect.turningVelocity;
    } else {
        return 0;
    }
}

module.exports = {
    type: TYPE,
    activate: activate,
    update: update,
    getWormTurningVelocity: getWormTurningVelocity
};
