function addEffect(gameState, effect) {
    gameState.effects.push(effect)
}

function getEffect(gameState, effectId) {
    return gameState.effects.find(e => e.id === effectId);
}

function getEnemyWorms(gamesState, wormId) {
    return gamesState.worms.filter(w => w.playerId !== getWorm(gamesState, wormId).playerId);
}

function getPowerUp(gameState, powerUpId) {
    return gameState.powerUps.find(p => p.id === powerUpId);
}

function getWorm(gameState, wormId) {
    return gameState.worms.find(w => w.id === wormId);
}

function getPlayer(gameState, id) {
    var player = gameState.players.find(p => p.id === id);
    if(player) {
        return player;
    } else {
        return getWorm(gameState, id);
    }
}

function getWormEffects(gameState, wormId, effectType) {
    var effects = gameState.effects.filter(function (effect) {
        return effect.wormId === wormId;
    });
    if (effectType) {
        return effects.filter(e => e.type === effectType);
    } else {
        return effects;
    }
}

function hasWormEffect(gameState, wormId, effectType) {
    return getWormEffects(gameState, wormId, effectType).length > 0;
}

function getAlivePlayers(gameState) {
    return gameState.players.filter(p => p.alive);
}

function isPlayerAlive(gameState, playerId) {
    return !!getAlivePlayers(gameState).find(p => p.id === playerId);
}

function getLastClearTime(gameState, endTime) {
    var res = 0;
    gameState.gameEvents.forEach(function (gameEvent) {
        if (gameEvent.type === "clear") {
            if (endTime === undefined || gameEvent.time <= endTime) {
                res = gameEvent.time;
            }
        }
    });
    return res;
}

module.exports = {
    addEffect: addEffect,
    getEffect: getEffect,
    getEnemyWorms: getEnemyWorms,
    getLastClearTime: getLastClearTime,
    getPowerUp: getPowerUp,
    getPlayer: getPlayer,
    getWorm: getWorm,
    getWormEffects: getWormEffects,
    getAlivePlayers: getAlivePlayers,
    hasWormEffect: hasWormEffect,
    isPlayerAlive: isPlayerAlive
};
