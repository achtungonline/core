var constants = require("./constants.js");
var shapeFactory = require("./geometry/shape-factory.js");

function addPlayer(gameState, id) {
    gameState.players.push({
        id,
        alive: true,
        steering: constants.STEERING_STRAIGHT,
        gameTimeWhenSteeringChanged: 0,
        steeringSegments: [{
            steering: constants.STEERING_STRAIGHT,
            startTime: 0,
            deltaTime: 0
        }]
    });
}

function addWorm(gameState, id, playerId) {
    gameState.worms.push({
        id,
        playerId,
        head: shapeFactory.createCircle(constants.WORM_RADIUS, 0, 0),
        size: constants.WORM_RADIUS * 2,
        direction: 0,
        speed: constants.WORM_SPEED,
        turningSpeed: constants.WORM_TURNING_SPEED,
        alive: true,
        pathSegments: [],
        jump: {
            remainingJumpTime: 0,
            timeSinceLastJump: 0
        }
    });
}

function addEffect(gameState, effect) {
    gameState.effects.push(effect)
}

function createMap(name, shape, blockingShapes) {
    return {
        name,
        shape,
        blockingShapes: blockingShapes || [],
        width: shape.boundingBox.width,
        height: shape.boundingBox.height
    }
}

function createMapCircle(name, radius, blockingShapes) {
    return createMap(name, shapeFactory.createCircle(radius, 0, 0), blockingShapes);
}

function createMapRectangle(name, width, height, blockingShapes) {
    return createMap(name, shapeFactory.createRectangle(width, height, 0, 0), blockingShapes);
}

function createMapSquare(name, size, blockingShapes) {
    return createMapRectangle(name, size, size, blockingShapes);
}

function forEachAlivePlayer(gameState, callback) {
    gameState.players.forEach(function (player) {
        if (player.alive) {
            callback(player);
        }
    });
}

function forEachAliveWorm(gameState, callback, playerId) {
    gameState.worms.forEach(function (worm) {
        if (worm.alive && (playerId === undefined || worm.playerId === playerId)) {
            callback(worm);
        }
    });
}

function getAlivePlayers(gameState) {
    return gameState.players.filter(p => p.alive);
}

function getAliveWorms(gameState, playerId) {
    return gameState.worms.filter(w => w.alive && (playerId === undefined || w.playerId === playerId));
}

function getEffect(gameState, effectId) {
    return gameState.effects.find(e => e.id === effectId);
}

function getEnemyWorms(gamesState, wormId) {
    return gamesState.worms.filter(w => w.playerId !== getWorm(gamesState, wormId).playerId);
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

function getMapShape(gameState) {
    return gameState.map.shape;
}

function getPlayer(gameState, id) {
    var player = gameState.players.find(p => p.id === id);
    if (player) {
        return player;
    } else {
        return getWorm(gameState, id);
    }
}

function getPowerUp(gameState, powerUpId) {
    return gameState.powerUps.find(p => p.id === powerUpId);
}

function getWorm(gameState, wormId) {
    return gameState.worms.find(w => w.id === wormId);
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

function isPlayerAlive(gameState, playerId) {
    return !!getAlivePlayers(gameState).find(p => p.id === playerId);
}

function resetPlayArea(gameState) {
    var grid = gameState.playArea.grid;
    for (var i = 0; i < grid.length; i++) {
        grid[i] = constants.PLAY_AREA_FREE;
    }
}

function createGameState(map, seed) {
    function createPlayArea(width, height) {
        var playArea = {
            rows: height,
            cols: width,
            grid: new Array(height * width)
        };
        for (var i = 0; i < playArea.grid.length; i++) {
            playArea.grid[i] = constants.PLAY_AREA_FREE;
        }
        return playArea;
    }

    return {
        players: [
            //  {
            //      id,
            //      steering,
            //      steeringSegments: [ {steering, startTime, duration} ],
            //      gameTimeWhenSteeringChanged
            //      alive
            //  }
        ],
        worms: [
            //  {
            //      id,
            //      playerId,
            //      head,
            //      direction,
            //      speed,
            //      turningSpeed,
            //      alive,
            //      jump: {
            //          remainingJumpTime: 0,
            //          timeSinceLastJump: 0
            //      },
            //      pathSegments: [
            //          {type: straight/curve, duration, startTime, jump, playerId, startX, startY, startDirection, endX, endY, endDirection}
            //      ]
            //      immunityData: undefined
            //      }
        ],
        powerUps: [
            //  {
            //      id
            //      name
            //      shape
            //      effectType
            //      effectStrength  // Higher means more potent, negative could mean reversed. For speed effect, -1 means decreased speed for example
            //      effectDuration  // The duration for the effect, if it has one
            //      affects         // all | others | self
            //  }
        ],
        effects: [                  // Effects only gets created from worms going into powerUps
            //  {
            //      type,
            //      remainingDuration,
            //      wormId,
            //      strength,           // Comes from the power-ups effectStrength
            //  }
        ],
        gameEvents: [],
        map: map,
        playArea: createPlayArea(map.width, map.height),
        playAreaUpdateBuffer: [],
        gameTime: 0,
        gameActive: false,                           // TODO: might get removed and replaced with just phase
        phaseTimer: 0,                               // Time left until next phase starts (only interesting between startPhase and playPhase)
        phase: "notStartedPhase",                    // notStartedPhase | startPhase | playPhase | roundOverPhase
        seed: seed
    };
}

module.exports = {
    addEffect,
    addPlayer,
    addWorm,
    createGameState,
    createMap,
    createMapCircle,
    createMapRectangle,
    createMapSquare,
    forEachAlivePlayer,
    forEachAliveWorm,
    getAlivePlayers,
    getAliveWorms,
    getEffect,
    getEnemyWorms,
    getLastClearTime,
    getMapShape,
    getPowerUp,
    getPlayer,
    getWorm,
    getWormEffects,
    hasWormEffect,
    isPlayerAlive,
    resetPlayArea
};