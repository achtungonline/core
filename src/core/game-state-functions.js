var constants = require("./constants.js");
var shapeFactory = require("./geometry/shape-factory.js");
var effectIdGenerator = require("./util/id-generator.js").indexCounterId(0);
var powerUpIdGenerator = require("./util/id-generator.js").indexCounterId(0);

function addEffect(gameState, effect) {
    effect.id = effectIdGenerator();
    gameState.effects.push(effect);
    gameState.effectEvents.push({
        type: "spawn",
        time: gameState.gameTime,
        effect: effect
    });
}

function addPlayer(gameState, id) {
    gameState.players.push({
        id,
        alive: true,
        steering: constants.STEERING_STRAIGHT,
        gameTimeWhenSteeringChanged: 0
    });
    gameState.playerSteeringSegments[id] = [];
}

function addPlayerSteeringSegment(gameState, playerId, steering, duration) {
    var steeringSegments = gameState.playerSteeringSegments[playerId];
    if (steeringSegments.length > 0 && steeringSegments[steeringSegments.length - 1].steering === steering) {
        steeringSegments[steeringSegments.length - 1].duration += duration;
    } else {
        steeringSegments.push({
            steering: steering,
            startTime: gameState.gameTime - duration,
            duration: duration
        });
    }
}

function addPowerUp(gameState, powerUp) {
    powerUp.id = powerUpIdGenerator();
    gameState.powerUps.push(powerUp);
    gameState.powerUpEvents.push({
        type: "spawn",
        time: gameState.gameTime,
        powerUp: powerUp
    })
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
        jump: {
            remainingJumpTime: 0,
            timeSinceLastJump: 0
        }
    });
    gameState.wormPathSegments[id] = [];
}

function addWormPathSegment(gameState, wormId, segment) {
    var segments = gameState.wormPathSegments[wormId];
    if (segments.length === 0) {
        segments.push(segment);
    } else {
        var lastSegment = segments[segments.length - 1];
        if (    segment.type === lastSegment.type &&
                segment.speed === lastSegment.speed &&
                segment.turningVelocity === lastSegment.turningVelocity &&
                segment.size === lastSegment.size &&
                segment.playerId === lastSegment.playerId &&
                segment.jump === lastSegment.jump) {

            // Continue last segment
            lastSegment.duration += segment.duration;
            lastSegment.endTime += segment.duration;
            lastSegment.endX = segment.endX;
            lastSegment.endY = segment.endY;
            lastSegment.endDirection = segment.endDirection;
            if (segment.type === "arc") {
                lastSegment.arcEndAngle = segment.arcEndAngle;
                lastSegment.arcAngleDiff += segment.arcAngleDiff;
            }
        } else {
            // Start new segment
            segments.push(segment);
        }
    }
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

function removeEffect(gameState, effectId) {
    gameState.effectEvents.push({
        type: "despawn",
        time: gameState.gameTime,
        id: effectId
    });
    gameState.effects.splice(gameState.effects.findIndex(effect => effect.id === effectId), 1);
}

function removePowerUp(gameState, powerUpId) {
    gameState.powerUpEvents.push({
        type: "despawn",
        time: gameState.gameTime,
        id: powerUpId
    });
    gameState.powerUps.splice(gameState.powerUps.findIndex(powerUp => powerUp.id === powerUpId), 1);
}

function resetPlayArea(gameState) {
    var grid = gameState.playArea.grid;
    for (var i = 0; i < grid.length; i++) {
        grid[i] = constants.PLAY_AREA_FREE;
    }
}

function setPlayerSteering(gameState, playerId, steering) {
    var player = getPlayer(gameState, playerId);
    if (player.steering !== steering) {
        player.gameTimeWhenSteeringChanged = gameState.gameTime;
        player.steering = steering;
    }
}

function extractReplayGameState(gameState) {
    return {
        worms: gameState.worms.map(worm => ({ id: worm.id })),
        players: gameState.players.map(player => ({ id: player.id })),
        wormPathSegments: gameState.wormPathSegments,
        gameEvents: gameState.gameEvents,
        powerUpEvents: gameState.powerUpEvents,
        effectEvents: gameState.effectEvents,
        gameTime: gameState.gameTime,
        map: gameState.map
    };
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
            //      gameTimeWhenSteeringChanged,
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

            //      immunityData: undefined
            //      }
        ],
        powerUps: [
            //  {
            //      id,
            //      name,
            //      shape,
            //      effectType,
            //      effectStrength, // Higher means more potent, negative could mean reversed. For speed effect, -1 means decreased speed for example
            //      effectDuration, // The duration for the effect, if it has one
            //      affects         // all | others | self
            //  }
        ],
        effects: [                  // Effects only gets created from worms going into powerUps
            //  {
            //      type,
            //      remainingDuration,
            //      wormId,
            //      strength            // Comes from the power-ups effectStrength
            //  }
        ],
        playerSteeringSegments: {
            //  [
            //      steering,
            //      startTime,
            //      duration
            //  ]
        },
        wormPathSegments: {
            //  [
            //      type,           // straight | arc | still_arc
            //      duration,
            //      startTime,
            //      endTime,
            //      jump,           // true | false
            //      size,
            //      playerId,
            //      startX,
            //      startY,
            //      startDirection,
            //      endX,
            //      endY,
            //      endDirection
            //  ]
        },
        gameEvents: [
            //      type,           // game_start | player_died | game_over
            //      time
            //      (id)            // Only for type player_died
        ],
        powerUpEvents: [
            //      type,           // spawn | despawn
            //      time,
            //      (powerUp),      // Only for type spawn
            //      (id)            // Only for type despawn
        ],
        effectEvents: [
            //      type,
            //      time
            //      (effect)        // Only for type spawn
            //      (id)            // Only for type despawn
        ],
        map: map,
        playArea: createPlayArea(map.width, map.height),
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
    addPlayerSteeringSegment,
    addPowerUp,
    addWorm,
    addWormPathSegment,
    createGameState,
    createMap,
    createMapCircle,
    createMapRectangle,
    createMapSquare,
    extractReplayGameState,
    forEachAlivePlayer,
    forEachAliveWorm,
    getAlivePlayers,
    getAliveWorms,
    getEffect,
    getEnemyWorms,
    getPowerUp,
    getPlayer,
    getWorm,
    getWormEffects,
    hasWormEffect,
    isPlayerAlive,
    removeEffect,
    removePowerUp,
    resetPlayArea,
    setPlayerSteering
};