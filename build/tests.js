(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var shapeFactory = require("./geometry/shape-factory.js");
var forEach = require("./util/for-each.js");

var wormColors = {
    blue: "#03A9F4",
    pink: "#E91E63",
    green: "#4CAF50",
    purple: "#9C27B0",
    orange: "#FF9800",
    lime: "#CDDC39",
    indigo: "#3F51B5",
    teal: "#009688",
    black: "#444",
    bluegrey: "#607D8B"
};
var wormColorIds = [];
forEach(wormColors, function (color, id) {
    return wormColorIds.push(id);
});

var powerUpDefinitions = {};
powerUpDefinitions["speed"] = {
    name: "speed",
    effectType: "speed",
    effectDuration: 5,
    effectStrength: 3 / 2,
    weightedSpawnChance: 1,
    affects: "self"
};
powerUpDefinitions["slow"] = {
    name: "slow",
    effectType: "speed",
    effectDuration: 5,
    effectStrength: 2 / 3,
    weightedSpawnChance: 1,
    affects: "others"
};
powerUpDefinitions["fat"] = {
    name: "fat",
    effectType: "size",
    effectDuration: 5,
    effectStrength: 2,
    weightedSpawnChance: 1,
    affects: "others"
};
powerUpDefinitions["slim"] = {
    name: "slim",
    effectType: "size",
    effectDuration: 5,
    effectStrength: 0.5,
    weightedSpawnChance: 1,
    affects: "self"
};
powerUpDefinitions["quick_turn"] = {
    name: "quick_turn",
    effectType: "turningSpeed",
    effectDuration: 5,
    effectStrength: 3 / 2,
    weightedSpawnChance: 1,
    affects: "self"
};
powerUpDefinitions["slow_turn"] = {
    name: "slow_turn",
    effectType: "turningSpeed",
    effectDuration: 5,
    effectStrength: 2 / 3,
    weightedSpawnChance: 1,
    affects: "others"
};
powerUpDefinitions["switcharoonie"] = {
    name: "switcharoonie",
    effectType: "wormSwitch",
    weightedSpawnChance: 1000.5,
    affects: "all"
};
powerUpDefinitions["key_switch"] = {
    name: "key_switch",
    effectType: "turningSpeed",
    effectDuration: 5,
    effectStrength: -1,
    weightedSpawnChance: 1,
    affects: "others"
};
powerUpDefinitions["drunk"] = {
    name: "drunk",
    effectType: "drunk",
    effectDuration: 5,
    effectStrength: 1,
    weightedSpawnChance: 1,
    affects: "others"
};
powerUpDefinitions["clear_all"] = {
    name: "clear",
    effectType: "clear",
    weightedSpawnChance: 1000.25,
    affects: "all"
};
powerUpDefinitions["clear_self"] = {
    name: "clear",
    effectType: "clear",
    weightedSpawnChance: 1000.25,
    affects: "self"
};
powerUpDefinitions["clear_others"] = {
    name: "clear",
    effectType: "clear",
    weightedSpawnChance: 1000.25,
    affects: "others"
};
powerUpDefinitions["super_jump"] = {
    name: "super_jump",
    effectType: "superJump",
    effectDuration: 5,
    weightedSpawnChance: 1,
    affects: "self"
};
powerUpDefinitions["tron_turn"] = {
    name: "tron_turn",
    effectType: "tronTurn",
    effectDuration: 5,
    weightedSpawnChance: 1,
    affects: "others"
};
powerUpDefinitions["twin"] = {
    name: "twin",
    effectType: "twin",
    effectDuration: 5,
    weightedSpawnChance: 1,
    affects: "self"
};

powerUpDefinitions["wall_hack_self"] = {
    name: "wall_hack",
    effectType: "wallHack",
    effectDuration: 5,
    weightedSpawnChance: 0.5,
    affects: "self"
};

powerUpDefinitions["wall_hack_all"] = {
    name: "wall_hack",
    effectType: "wallHack",
    effectDuration: 5,
    weightedSpawnChance: 0.5,
    affects: "all"
};

module.exports = {
    START_PHASE_DURATION: 2.5,
    START_DISTANCE_TO_MAP: 50,
    START_DISTANCE_TO_WORMS: 70,

    wormColors: wormColors,
    wormColorIds: wormColorIds,

    powerUpDefinitions: powerUpDefinitions,
    POWER_UP_SPAWN_CHANCE: 0.12, // Inverse of maximum time between power up spawns (seconds). 0.1 means max 10 seconds, average 5 seconds.
    POWER_UP_SHAPE: shapeFactory.createCircle(25),

    WORM_RADIUS: 4,
    WORM_SPEED: 90,
    WORM_TURNING_SPEED: 3,

    JUMP_COOLDOWN: 1.5, // After a jump, this is the minimum waiting time until another jump
    JUMP_LENGTH: 30, // The length of a jump
    JUMP_CHANCE: 0.4, // 0.5 means 50 % chance of jump after 1 second has passed (after the JUMP_COOLDOWN has passed).

    IMMUNITY_DISTANCE_MULTIPLIER: 6,

    STEERING_STRAIGHT: 0,
    STEERING_LEFT: -1,
    STEERING_RIGHT: 1,

    PLAY_AREA_FREE: -1,
    PLAY_AREA_OBSTACLE: -2
};

},{"./geometry/shape-factory.js":4,"./util/for-each.js":11}],2:[function(require,module,exports){
"use strict";

var gsf = require("./game-state-functions.js");

//jasmine.pp = function (obj) {
//    return JSON.stringify(obj, undefined, 2);
//};

describe("game-state-functions", function () {

    it("getPlayer", function () {
        expect(function () {
            return gsf.getPlayer(gsf.createGameState({}));
        }).toThrow();
        expect(function () {
            return gsf.getPlayer(gsf.createGameState({}), "0");
        }).toThrow();

        expect(gsf.getPlayer(gsf.createGameState({ players: [{ id: "0" }] }), "0")).toEqual({ id: "0" });
        expect(gsf.getPlayer(gsf.createGameState({ players: [{ id: "0" }], worms: [{ id: "1", playerId: "0" }] }), "1")).toEqual({ id: "0" });
        expect(gsf.getPlayer(gsf.createGameState({ players: [{ id: "0" }], worms: [{ id: "1", playerId: "0" }] }), "1")).toEqual({ id: "0" });
        expect(gsf.getPlayer(gsf.createGameState({ players: [{ id: "0" }], wormPathSegments: { "1": [{ playerId: "0" }] } }), "1")).toEqual({ id: "0" });
    });

    it("addWormPathSegmentMetaData", function () {
        var gameState = gsf.createSimpleGameState({
            wormPathSegments: {
                0: [{ someValue: "something", metaData: [] }]
            }
        });
        gsf.addWormPathSegmentMetaData(gameState, 0, { type: "clear" }, false);
        expect(gameState).toEqual({
            wormPathSegments: {
                0: [{ someValue: "something", metaData: [{ type: "clear" }] }]
            }
        });

        gameState = gsf.createSimpleGameState({
            gameTime: 200,
            wormPathSegments: {
                0: [{
                    duration: 0.9020000000000006,
                    startX: 454.1021586650029,
                    startY: 109.67382746062911,
                    startDirection: 12.333971739254988,
                    speed: 90,
                    turningVelocity: 3,
                    type: "arc",
                    arcCenterX: 461.0115357473077,
                    arcCenterY: 138.8673285924653,
                    arcRadius: 30,
                    arcStartAngle: 10.763175412460091,
                    arcAngleDiff: 2.7060000000000013,
                    arcEndAngle: 13.469175412460098,
                    endX: 479.59384931496,
                    endY: 162.41934809129864,
                    endDirection: 15.039971739254995,
                    startTime: 26.76199999999935,
                    endTime: 27.663999999999312,
                    jump: false,
                    size: 4,
                    playerId: "player_1",
                    wormId: "worm_0",
                    metaData: [],
                    index: 0
                }]
            }
        });

        gsf.addWormPathSegmentMetaData(gameState, 0, { type: "clear" }, true);
        expect(gameState).toEqual({
            gameTime: 200,
            wormPathSegments: {
                0: [{
                    duration: 0.9020000000000006,
                    startX: 454.1021586650029,
                    startY: 109.67382746062911,
                    startDirection: 12.333971739254988,
                    speed: 90,
                    turningVelocity: 3,
                    type: "arc",
                    arcCenterX: 461.0115357473077,
                    arcCenterY: 138.8673285924653,
                    arcRadius: 30,
                    arcStartAngle: 10.763175412460091,
                    arcAngleDiff: 2.7060000000000013,
                    arcEndAngle: 13.469175412460098,
                    endX: 479.59384931496,
                    endY: 162.41934809129864,
                    endDirection: 15.039971739254995,
                    startTime: 26.76199999999935,
                    endTime: 27.663999999999312,
                    jump: false,
                    size: 4,
                    playerId: "player_1",
                    wormId: "worm_0",
                    metaData: [],
                    index: 0
                }, {
                    duration: 0,
                    startX: 479.59384931496,
                    startY: 162.41934809129864,
                    startDirection: 15.039971739254995,
                    speed: 90,
                    turningVelocity: 3,
                    type: "arc",
                    arcCenterX: 461.01153574730796,
                    arcCenterY: 138.86732859246464,
                    arcRadius: 30,
                    arcStartAngle: 13.469175412460098,
                    arcAngleDiff: 0,
                    arcEndAngle: 13.469175412460098,
                    endX: 479.5938493149599,
                    endY: 162.41934809129867,
                    endDirection: 15.039971739254995,
                    startTime: 200,
                    endTime: 200,
                    jump: false,
                    size: 4,
                    playerId: "player_1",
                    wormId: "worm_0",
                    metaData: [{ type: "clear" }],
                    index: 1
                }, {
                    duration: 0,
                    startX: 479.59384931496,
                    startY: 162.41934809129864,
                    startDirection: 15.039971739254995,
                    speed: 90,
                    turningVelocity: 3,
                    type: "arc",
                    arcCenterX: 461.01153574730796,
                    arcCenterY: 138.86732859246464,
                    arcRadius: 30,
                    arcStartAngle: 13.469175412460098,
                    arcAngleDiff: 0,
                    arcEndAngle: 13.469175412460098,
                    endX: 479.5938493149599,
                    endY: 162.41934809129867,
                    endDirection: 15.039971739254995,
                    startTime: 200,
                    endTime: 200,
                    jump: false,
                    size: 4,
                    playerId: "player_1",
                    wormId: "worm_0",
                    metaData: [],
                    index: 2
                }]
            }
        });
    });
});

},{"./game-state-functions.js":3}],3:[function(require,module,exports){
"use strict";

var constants = require("./constants.js");
var shapeFactory = require("./geometry/shape-factory.js");
var shapeToGridConverter = require("./geometry/shape-to-grid-converter.js").createShapeToGridConverter();
var forEach = require("./util/for-each.js");
var trajectoryUtil = require("./geometry/trajectory/trajectory-util.js");
var clone = require("./util/clone.js");

function addEffect(gameState, effect) {
    effect.id = getNextId(gameState, "effect");
    gameState.effects.push(effect);
    gameState.effectEvents.push({
        type: "spawn",
        time: gameState.gameTime,
        effect: effect
    });
}

function addPlayer(gameState, _ref) {
    var clientId = _ref.clientId;
    var _ref$id = _ref.id;
    var id = _ref$id === undefined ? getNextId("player") : _ref$id;

    gameState.players.push({
        id: id,
        clientId: clientId,
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
    powerUp.id = getNextId(gameState, "power-up");
    gameState.powerUps.push(powerUp);
    gameState.powerUpEvents.push({
        type: "spawn",
        time: gameState.gameTime,
        powerUp: powerUp
    });
}

function addWorm(gameState, _ref2) {
    var _ref2$id = _ref2.id;
    var id = _ref2$id === undefined ? getNextId(gameState, "worm") : _ref2$id;
    var playerId = _ref2.playerId;
    var _ref2$direction = _ref2.direction;
    var direction = _ref2$direction === undefined ? 0 : _ref2$direction;
    var centerX = _ref2.centerX;
    var centerY = _ref2.centerY;
    var _ref2$radius = _ref2.radius;
    var radius = _ref2$radius === undefined ? constants.WORM_RADIUS : _ref2$radius;
    var _ref2$speed = _ref2.speed;
    var speed = _ref2$speed === undefined ? constants.WORM_SPEED : _ref2$speed;
    var _ref2$turningSpeed = _ref2.turningSpeed;
    var turningSpeed = _ref2$turningSpeed === undefined ? constants.WORM_TURNING_SPEED : _ref2$turningSpeed;
    var _ref2$distanceTravell = _ref2.distanceTravelled;
    var distanceTravelled = _ref2$distanceTravell === undefined ? 0 : _ref2$distanceTravell;
    var _ref2$distanceTravell2 = _ref2.distanceTravelledFromCells;
    var distanceTravelledFromCells = _ref2$distanceTravell2 === undefined ? {} : _ref2$distanceTravell2;

    var worm = {
        id: id,
        playerId: playerId,
        centerX: centerX,
        centerY: centerY,
        radius: radius,
        direction: direction,
        speed: speed,
        turningSpeed: turningSpeed,
        alive: true,
        jump: {
            remainingJumpTime: 0,
            timeSinceLastJump: 0
        },
        distanceTravelled: distanceTravelled,
        distanceTravelledFromCells: distanceTravelledFromCells
    };
    gameState.worms.push(worm);
    return worm;
}

function addWormPathSegment(gameState, id, segment) {
    var forceNewSegment = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    var segments = gameState.wormPathSegments[id];
    if (!segments) {
        segments = gameState.wormPathSegments[id] = [];
    }
    if (segment.index !== undefined) {
        // This segment has been added to the gameState already. Probably sent from server to client //TODO: Vill vi verkligen ha sånt här? Kanske kan få bort detta från core och försöka minimera server-relaterade saker.
        segments[segment.index] = segment;
    } else {
        if (segments.length === 0) {
            segment.index = 0;
            segments.push(segment);
        } else {
            var lastSegment = segments[segments.length - 1];
            if (!forceNewSegment && segment.type === lastSegment.type && segment.speed === lastSegment.speed && segment.turningVelocity === lastSegment.turningVelocity && segment.size === lastSegment.size && segment.playerId === lastSegment.playerId && segment.jump === lastSegment.jump && segment.startDirection === lastSegment.endDirection && segment.startX === lastSegment.endX && segment.startY === lastSegment.endY) {

                // Continue last segment
                if (segment.type !== "clear") {
                    lastSegment.duration += segment.duration;
                    lastSegment.endTime += segment.duration;
                    lastSegment.endX = segment.endX;
                    lastSegment.endY = segment.endY;
                    lastSegment.endDirection = segment.endDirection;
                    if (segment.type === "arc") {
                        lastSegment.arcEndAngle = segment.arcEndAngle;
                        lastSegment.arcAngleDiff += segment.arcAngleDiff;
                    }
                }
            } else {
                // Start new segment
                segment.index = segments.length;
                segments.push(segment);
            }
        }
    }
}

function addWormPathSegmentMetaData(gameState, id, metaData, singlePointInTime) {
    var segment = getLatestWormPathSegment(gameState, id);
    if (singlePointInTime) {
        var singlePointInTimeSegment = trajectoryUtil.createTrajectory({
            duration: 0,
            startX: segment.endX,
            startY: segment.endY,
            startDirection: segment.endDirection,
            speed: segment.speed,
            turningVelocity: segment.turningVelocity
        });
        singlePointInTimeSegment.startTime = gameState.gameTime;
        singlePointInTimeSegment.endTime = gameState.gameTime;
        singlePointInTimeSegment.jump = segment.jump;
        singlePointInTimeSegment.size = segment.size;
        singlePointInTimeSegment.playerId = segment.playerId;
        singlePointInTimeSegment.wormId = segment.wormId;
        singlePointInTimeSegment.metaData = clone(segment.metaData);
        var segmentAfter = clone(singlePointInTimeSegment);
        singlePointInTimeSegment.metaData.push(metaData);
        addWormPathSegment(gameState, id, singlePointInTimeSegment, true);
        addWormPathSegment(gameState, id, segmentAfter, true);
    } else {
        segment.metaData.push(metaData);
    }
}

function createMap(_ref3) {
    var name = _ref3.name;
    var shape = _ref3.shape;
    var _ref3$borderWidth = _ref3.borderWidth;
    var borderWidth = _ref3$borderWidth === undefined ? 0 : _ref3$borderWidth;
    var _ref3$blockingShapes = _ref3.blockingShapes;
    var blockingShapes = _ref3$blockingShapes === undefined ? [] : _ref3$blockingShapes;

    return {
        name: name,
        shape: shape,
        borderWidth: borderWidth,
        blockingShapes: blockingShapes,
        width: shape.boundingBox.width + 2 * borderWidth,
        height: shape.boundingBox.height + 2 * borderWidth
    };
}

function createMapCircle(_ref4) {
    var radius = _ref4.radius;
    var _ref4$name = _ref4.name;
    var name = _ref4$name === undefined ? "Circle " + radius : _ref4$name;
    var _ref4$borderWidth = _ref4.borderWidth;
    var borderWidth = _ref4$borderWidth === undefined ? 10 : _ref4$borderWidth;
    var _ref4$blockingShapes = _ref4.blockingShapes;
    var blockingShapes = _ref4$blockingShapes === undefined ? [] : _ref4$blockingShapes;

    return createMap({
        name: name,
        shape: shapeFactory.createCircle(radius, borderWidth, borderWidth),
        borderWidth: borderWidth,
        blockingShapes: blockingShapes
    });
}

function createMapRectangle(_ref5) {
    var width = _ref5.width;
    var height = _ref5.height;
    var _ref5$name = _ref5.name;
    var name = _ref5$name === undefined ? "Rectangle " + width + " " + height : _ref5$name;
    var _ref5$borderWidth = _ref5.borderWidth;
    var borderWidth = _ref5$borderWidth === undefined ? 10 : _ref5$borderWidth;
    var _ref5$blockingShapes = _ref5.blockingShapes;
    var blockingShapes = _ref5$blockingShapes === undefined ? [] : _ref5$blockingShapes;

    return createMap({
        name: name,
        shape: shapeFactory.createRectangle(width, height, borderWidth, borderWidth),
        borderWidth: borderWidth,
        blockingShapes: blockingShapes
    });
}

function createMapSquare(_ref6) {
    var size = _ref6.size;
    var _ref6$name = _ref6.name;
    var name = _ref6$name === undefined ? "Square " + size : _ref6$name;
    var _ref6$borderWidth = _ref6.borderWidth;
    var borderWidth = _ref6$borderWidth === undefined ? 10 : _ref6$borderWidth;
    var _ref6$blockingShapes = _ref6.blockingShapes;
    var blockingShapes = _ref6$blockingShapes === undefined ? [] : _ref6$blockingShapes;

    return createMapRectangle({
        name: name,
        width: size,
        height: size,
        borderWidth: borderWidth,
        blockingShapes: blockingShapes
    });
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

function forEachAliveLatestWormPathSegment(gameState, callback, playerId) {
    var latestSegments = [];
    forEach(gameState.wormPathSegments, function (segments) {
        if (segments.length === 0) {
            return;
        }
        latestSegments.push(segments[segments.length - 1]);
    });
    latestSegments.forEach(function (latestSegment) {
        if (latestSegment.endTime !== gameState.gameTime) {
            return;
        }
        if (getWorm(gameState, latestSegment.wormId).alive && (playerId === undefined || latestSegment.playerId === playerId)) {
            callback(latestSegment);
        }
    });
}

function getAlivePlayers(gameState) {
    return gameState.players.filter(function (p) {
        return p.alive;
    });
}

function getAliveWorms(gameState, playerId) {
    return gameState.worms.filter(function (w) {
        return w.alive && (playerId === undefined || w.playerId === playerId);
    });
}

function getLatestWormPathSegment(gameState, segmentId) {
    return gameState.wormPathSegments[segmentId][gameState.wormPathSegments[segmentId].length - 1];
}

function getEffect(gameState, effectId) {
    return gameState.effects.find(function (e) {
        return e.id === effectId;
    });
}

function getAliveEnemyWorms(gamesState, wormId) {
    return getAliveWorms(gamesState).filter(function (w) {
        return w.playerId !== getWorm(gamesState, wormId).playerId;
    });
}

function getPlayer(gameState, id) {
    if (id === null || id === undefined) {
        throw new Error("Id must be set");
    }
    var player = gameState.players.find(function (p) {
        return p.id === id;
    });
    if (player) {
        return player;
    } else {
        var worm = getWorm(gameState, id);
        if (worm) {
            return getPlayer(gameState, worm.playerId);
        } else {
            return getPlayer(gameState, getLatestWormPathSegment(gameState, id).playerId);
        }
    }
}

function getPowerUp(gameState, powerUpId) {
    return gameState.powerUps.find(function (p) {
        return p.id === powerUpId;
    });
}

function getWorm(gameState, wormId) {
    return gameState.worms.find(function (w) {
        return w.id === wormId;
    });
}

function getWormEffects(gameState, wormId, effectType) {
    var effects = gameState.effects.filter(function (effect) {
        return effect.wormId === wormId;
    });
    if (effectType) {
        return effects.filter(function (e) {
            return e.type === effectType;
        });
    } else {
        return effects;
    }
}

function getWormEffect(gameState, wormId, effectType) {
    var effects = getWormEffects(gameState, wormId, effectType);
    return effects.length !== 0 ? effects[0] : null;
}

function hasWormEffect(gameState, wormId, effectType) {
    return getWormEffects(gameState, wormId, effectType).length > 0;
}

function isPlayerAlive(gameState, playerId) {
    return !!getAlivePlayers(gameState).find(function (p) {
        return p.id === playerId;
    });
}

function removeEffect(gameState, effectId) {
    gameState.effectEvents.push({
        type: "despawn",
        time: gameState.gameTime,
        id: effectId
    });
    gameState.effects.splice(gameState.effects.findIndex(function (effect) {
        return effect.id === effectId;
    }), 1);
}

function removePowerUp(gameState, powerUpId) {
    gameState.powerUpEvents.push({
        type: "despawn",
        time: gameState.gameTime,
        id: powerUpId
    });
    gameState.powerUps.splice(gameState.powerUps.findIndex(function (powerUp) {
        return powerUp.id === powerUpId;
    }), 1);
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
        worms: gameState.worms.map(function (worm) {
            return { id: worm.id };
        }),
        players: gameState.players.map(function (player) {
            return { id: player.id };
        }),
        wormPathSegments: gameState.wormPathSegments,
        gameEvents: gameState.gameEvents,
        powerUpEvents: gameState.powerUpEvents,
        effectEvents: gameState.effectEvents,
        gameTime: gameState.gameTime,
        map: gameState.map
    };
}

function getNextId(gameState) {
    var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

    var nextId = prefix + "_" + gameState.nextId;
    gameState.nextId += 1;
    return nextId;
}

function addPlayAreaShape(gameState, shape, value) {
    var playArea = gameState.playArea;
    var points = shapeToGridConverter.convert(shape, playArea);
    var changedData = [];
    for (var i = 0; i < points.length; i++) {
        // Buffer should only be updated when a value has changed
        // TODO ATM we do not accept "painting over". If we were, worm worm collision would have issues since we would not collide against other worms, might want to fix this
        if (playArea.grid[points[i]] !== value) {
            playArea.grid[points[i]] = value;
            changedData.push({
                index: points[i],
                value: value
            });
        }
    }
    return changedData;
}

function addPlayAreaObstacle(gameState, shape) {
    return addPlayAreaShape(gameState, shape, constants.PLAY_AREA_OBSTACLE);
}

function isInStartPhase(gameState) {
    return gameState.gameActive && gameState.startPhaseTimer > 0;
}

function isInPlayPhase(gameState) {
    return gameState.gameActive && !isInStartPhase(gameState);
}

function createGameState() {
    var _ref7 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var map = _ref7.map;
    var seed = _ref7.seed;
    var _ref7$players = _ref7.players;
    var players = _ref7$players === undefined ? [] : _ref7$players;
    var _ref7$worms = _ref7.worms;
    var worms = _ref7$worms === undefined ? [] : _ref7$worms;
    var _ref7$powerUps = _ref7.powerUps;
    var powerUps = _ref7$powerUps === undefined ? [] : _ref7$powerUps;
    var _ref7$effects = _ref7.effects;
    var effects = _ref7$effects === undefined ? [] : _ref7$effects;
    var _ref7$playerSteeringS = _ref7.playerSteeringSegments;
    var playerSteeringSegments = _ref7$playerSteeringS === undefined ? {} : _ref7$playerSteeringS;
    var _ref7$wormPathSegment = _ref7.wormPathSegments;
    var wormPathSegments = _ref7$wormPathSegment === undefined ? {} : _ref7$wormPathSegment;
    var _ref7$gameEvents = _ref7.gameEvents;
    var gameEvents = _ref7$gameEvents === undefined ? [] : _ref7$gameEvents;
    var _ref7$powerUpEvents = _ref7.powerUpEvents;
    var powerUpEvents = _ref7$powerUpEvents === undefined ? [] : _ref7$powerUpEvents;
    var _ref7$effectEvents = _ref7.effectEvents;
    var effectEvents = _ref7$effectEvents === undefined ? [] : _ref7$effectEvents;
    var _ref7$gameTime = _ref7.gameTime;
    var gameTime = _ref7$gameTime === undefined ? 0 : _ref7$gameTime;
    var _ref7$gameActive = _ref7.gameActive;
    var gameActive = _ref7$gameActive === undefined ? false : _ref7$gameActive;
    var _ref7$startPhaseTimer = _ref7.startPhaseTimer;
    var startPhaseTimer = _ref7$startPhaseTimer === undefined ? constants.START_PHASE_DURATION : _ref7$startPhaseTimer;
    var _ref7$nextId = _ref7.nextId;
    var nextId = _ref7$nextId === undefined ? 0 : _ref7$nextId;

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

    return createSimpleGameState({
        players: players,
        //  [{
        //      id,
        //      steering,
        //      gameTimeWhenSteeringChanged,
        //      alive
        //  }]
        worms: worms,
        //  [{
        //      id,
        //      playerId,
        //      centerX,
        //      centerY,
        //      radius,
        //      direction,
        //      speed,
        //      turningSpeed,
        //      alive,
        //      jump: {
        //          remainingJumpTime: 0,
        //          timeSinceLastJump: 0
        //      },
        //      immunityData: undefined
        //      }]

        powerUps: powerUps,
        //  [{
        //      id,
        //      name,
        //      shape,
        //      effectType,
        //      effectStrength, // Higher means more potent, negative could mean reversed. For speed effect, -1 means decreased speed for example
        //      effectDuration, // The duration for the effect, if it has one
        //      affects         // all | others | self
        //  }]

        effects: effects,
        //  [{
        //      type,
        //      remainingDuration,
        //      wormId,
        //      strength            // Comes from the power-ups effectStrength
        //  }]
        playerSteeringSegments: playerSteeringSegments,
        //  {[
        //      steering,
        //      startTime,
        //      duration
        //  ]}
        wormPathSegments: wormPathSegments,
        //  {[
        //      type,           // straight | arc | still_arc
        //      index,          // the position of the segment in the list
        //      duration,
        //      startTime,
        //      endTime,
        //      jump,           // true | false
        //      size,
        //      playerId,
        //      startX,
        //      startY,
        //      startDirection,
        //      speed,
        //      turningVelocity
        //      endX,
        //      endY,
        //      endDirection
        //  ]}
        gameEvents: gameEvents,
        //  [{
        //      type,           // game_start | player_died | game_over
        //      time
        //      (id)            // Only for type player_died
        //  }],
        powerUpEvents: powerUpEvents,
        //  [{
        //      type,           // spawn | despawn
        //      time,
        //      (powerUp),      // Only for type spawn
        //      (id)            // Only for type despawn
        //  }],
        effectEvents: effectEvents,
        //  [{
        //      type,
        //      time
        //      (effect)        // Only for type spawn
        //      (id)            // Only for type despawn
        //  }],
        map: map,
        playArea: map ? createPlayArea(map.width, map.height) : null,
        gameTime: gameTime,
        gameActive: gameActive, // TODO: might get removed
        startPhaseTimer: startPhaseTimer, // Time left until start phase ends
        seed: seed,
        nextId: nextId
    });
}

function createSimpleGameState(options) {
    var gameState = {};
    forEach(options, function (value, key) {
        if (value !== null && value !== undefined) {
            gameState[key] = value;
        }
    });
    return gameState;
}

module.exports = {
    addEffect: addEffect,
    addWormPathSegmentMetaData: addWormPathSegmentMetaData,
    addPlayAreaObstacle: addPlayAreaObstacle,
    addPlayAreaShape: addPlayAreaShape,
    addPlayer: addPlayer,
    addPlayerSteeringSegment: addPlayerSteeringSegment,
    addPowerUp: addPowerUp,
    addWorm: addWorm,
    addWormPathSegment: addWormPathSegment,
    createGameState: createGameState,
    createSimpleGameState: createSimpleGameState,
    createMap: createMap,
    createMapCircle: createMapCircle,
    createMapRectangle: createMapRectangle,
    createMapSquare: createMapSquare,
    extractReplayGameState: extractReplayGameState,
    forEachAlivePlayer: forEachAlivePlayer,
    forEachAliveWorm: forEachAliveWorm,
    forEachAliveLatestWormPathSegment: forEachAliveLatestWormPathSegment,
    getAliveEnemyWorms: getAliveEnemyWorms,
    getAlivePlayers: getAlivePlayers,
    getAliveWorms: getAliveWorms,
    getEffect: getEffect,
    getLatestWormPathSegment: getLatestWormPathSegment,
    getNextId: getNextId,
    getPowerUp: getPowerUp,
    getPlayer: getPlayer,
    getWorm: getWorm,
    getWormEffect: getWormEffect,
    getWormEffects: getWormEffects,
    hasWormEffect: hasWormEffect,
    isInStartPhase: isInStartPhase,
    isInPlayPhase: isInPlayPhase,
    isPlayerAlive: isPlayerAlive,
    removeEffect: removeEffect,
    removePowerUp: removePowerUp,
    resetPlayArea: resetPlayArea,
    setPlayerSteering: setPlayerSteering
};

},{"./constants.js":1,"./geometry/shape-factory.js":4,"./geometry/shape-to-grid-converter.js":6,"./geometry/trajectory/trajectory-util.js":8,"./util/clone.js":10,"./util/for-each.js":11}],4:[function(require,module,exports){
"use strict";

/**
 * Represents the parameters for a generic shape.
 * @param type
 * @param boundingWidth
 * @param boundingHeight
 * @param x If undefined then no coordinate variables will be created
 * @param y If undefined then no coodinate variables will be created
 * @returns {{}}
 * @constructor
 */

function createShape(type, boundingWidth, boundingHeight, x, y, area) {
    function setCoordinates(target, boundingBox, x, y) {
        target.x = x;
        target.y = y;
        target.maxX = x + boundingBox.width;
        target.maxY = y + boundingBox.height;
        target.centerX = x + boundingBox.width / 2;
        target.centerY = y + boundingBox.height / 2;
    }

    function createBoundingBox(width, height) {
        return {
            width: width,
            height: height
        };
    }

    function isDefined(value) {
        return value !== undefined && value !== null;
    }

    var shape = {};
    shape.type = type;
    shape.boundingBox = createBoundingBox(boundingWidth, boundingHeight);
    shape.area = area;

    if (isDefined(x) && isDefined(y)) {
        // only set the coordinate parameters if x and y are provided
        setCoordinates(shape, shape.boundingBox, x, y);
    }

    return shape;
}

function createCircle(radius, x, y) {
    var area = Math.PI * radius * radius;
    var shape = createShape("circle", radius * 2, radius * 2, x, y, area);
    shape.radius = radius;
    return shape;
}

function createRectangle(width, height, x, y) {
    var area = width * height;
    var shape = createShape("rectangle", width, height, x, y, area);

    shape.width = width;
    shape.height = height;
    return shape;
}

function createSquare(size, x, y) {
    return createRectangle(size, size, x, y);
}

module.exports = {
    createCircle: createCircle,
    createRectangle: createRectangle,
    createSquare: createSquare
};

},{}],5:[function(require,module,exports){
"use strict";

var spatialRelations = module.exports = {};

spatialRelations.intersects = function intersects(shape, otherShape) {
    return isRelationTrue(intersectsFunctions, shape, otherShape);
};

spatialRelations.contains = function contains(outerShape, innerShape) {
    return isRelationTrue(containmentFunctions, outerShape, innerShape);
};

spatialRelations.distanceSquared = function distance(shape, otherShape) {
    var dist = getXYDist(shape, otherShape);
    return dist.x * dist.x + dist.y * dist.y;
};

// -- INTERSECTION-FUNCTIONS --
var intersectsFunctions = createShapeRelationMatrix();

intersectsFunctions["circle"]["circle"] = function circleCircleIntersection(circle, otherCircle) {
    if (!boundingBoxesIntersects(circle, otherCircle)) {
        return false;
    }

    var maxAllowedDist = circle.radius + otherCircle.radius;

    return spatialRelations.distanceSquared(circle, otherCircle) < maxAllowedDist * maxAllowedDist;
};

intersectsFunctions["rectangle"]["rectangle"] = function rectangleRectangleIntersection(rectangle, otherRectangle) {
    return boundingBoxesIntersects(rectangle, otherRectangle);
};

intersectsFunctions["circle"]["rectangle"] = function circleRectangleIntersection(circle, rectangle) {
    if (!boundingBoxesIntersects(circle, rectangle)) {
        return false;
    }

    var dist = getXYDist(circle, rectangle);

    //The following 2 checks are only valid because of prior checking of the bounding boxes
    if (dist.x <= rectangle.width / 2) {
        return true;
    }
    if (dist.y <= rectangle.height / 2) {
        return true;
    }

    // special case for rectangle corners
    var cornerDistX = dist.x - rectangle.width / 2;
    var cornerDistY = dist.y - rectangle.height / 2;
    var cornerDistanceSq = cornerDistX * cornerDistX + cornerDistY * cornerDistY;

    return cornerDistanceSq <= circle.radius * circle.radius;
};

intersectsFunctions["rectangle"]["circle"] = function rectangleCircleIntersection(rectangle, circle) {
    return intersectsFunctions["circle"]["rectangle"](circle, rectangle);
};

// -- CONTAINMENT-FUNCTIONS
var containmentFunctions = createShapeRelationMatrix();

containmentFunctions["circle"]["circle"] = function circleCircleContainment(outerCircle, innerCircle) {
    if (!boundingBoxesContains(outerCircle, innerCircle)) {
        return false;
    }

    var maxAllowedDist = outerCircle.radius - innerCircle.radius;

    return spatialRelations.distanceSquared(outerCircle, innerCircle) < maxAllowedDist * maxAllowedDist;
};

containmentFunctions["rectangle"]["rectangle"] = function rectangleRectangleContainment(outerRectangle, innerRectangle) {
    return boundingBoxesContains(outerRectangle, innerRectangle);
};

containmentFunctions["circle"]["rectangle"] = function circleRectangleContainment(outerCircle, innerRectangle) {
    if (!boundingBoxesContains(outerCircle, innerRectangle)) {
        return false;
    }

    //here we select the rectangles corner point furthest away from the circle center
    var distX = Math.max(Math.abs(outerCircle.centerX - innerRectangle.x), Math.abs(outerCircle.centerX - innerRectangle.maxX));
    var distY = Math.max(Math.abs(outerCircle.centerY - innerRectangle.y), Math.abs(outerCircle.centerY - innerRectangle.maxY));

    return distX * distX + distY * distY <= outerCircle.radius * outerCircle.radius;
};

containmentFunctions["rectangle"]["circle"] = function rectangleCircleContainment(outerRectangle, innerCircle) {
    return boundingBoxesContains(outerRectangle, innerCircle);
};

// -- UTILITY-FUNCTIONS --
function isRelationTrue(spatialRelationsFunctions, shape, otherShape) {
    function convertWormToCircle(w) {
        return {
            type: "circle",
            centerX: w.centerX,
            centerY: w.centerY,
            x: w.centerX - w.radius,
            y: w.centerY - w.radius,
            maxX: w.centerX + w.radius,
            maxY: w.centerY + w.radius,
            radius: w.radius,
            boundingBox: {
                width: w.radius * 2,
                height: w.radius * 2
            }
        };
    }
    // TODO Not the prettiest but works for now. This handles special worm treatment
    if (!shape.type) {
        shape = convertWormToCircle(shape);
    }

    if (!otherShape.type) {
        otherShape = convertWormToCircle(otherShape);
    }

    return spatialRelationsFunctions[shape.type][otherShape.type](shape, otherShape);
}

function boundingBoxesIntersects(shape, otherShape) {
    var dist = getXYDist(shape, otherShape);

    var minBoundingDistX = shape.boundingBox.width / 2 + otherShape.boundingBox.width / 2;
    var minBoundingDistY = shape.boundingBox.height / 2 + otherShape.boundingBox.height / 2;

    return !(dist.x > minBoundingDistX || dist.y > minBoundingDistY);
}

function boundingBoxesContains(outerShape, innerShape) {
    var dist = getXYDist(outerShape, innerShape);

    dist.x += innerShape.boundingBox.width / 2;
    dist.y += innerShape.boundingBox.height / 2;

    return dist.x < outerShape.boundingBox.width / 2 && dist.y < outerShape.boundingBox.height / 2;
}

function createShapeRelationMatrix() {
    var matrix = [];
    matrix["circle"] = [];
    matrix["rectangle"] = [];
    return matrix;
}

function getXYDist(shape, otherShape) {
    var dist = {};
    dist.x = Math.abs(shape.centerX - otherShape.centerX);
    dist.y = Math.abs(shape.centerY - otherShape.centerY);
    return dist;
}

},{}],6:[function(require,module,exports){
"use strict";

var gridUtils = require("./../util/grid.js");

var convertFunctions = {};
convertFunctions["rectangle"] = function rectToGrid(rect, grid, roundingMode) {
    var leftRow = Math.max(0, roundingMode.roundLeft(rect.y));
    var leftCol = Math.max(0, roundingMode.roundLeft(rect.x));

    var rightRow = Math.min(grid.rows - 1, roundingMode.roundRight(rect.maxY));
    var rightCol = Math.min(grid.cols - 1, roundingMode.roundRight(rect.maxX));

    var size = (rightRow - leftRow + 1) * (rightCol - leftCol + 1);
    var points = new Array(size);
    var index = 0;
    for (var row = leftRow; row <= rightRow; row++) {
        for (var col = leftCol; col <= rightCol; col++) {
            if (gridUtils.isInsideGrid(grid, row, col)) {
                points[index++] = gridUtils.getIndex(grid, row, col);
            }
        }
    }

    return points;
};
convertFunctions["circle"] = function circleToGrid(circle, grid, roundingMode) {
    var firstRow = Math.max(0, roundingMode.roundLeft(circle.y));
    var midRow = Math.round(circle.centerY);
    var lastRow = Math.min(grid.rows - 1, roundingMode.roundRight(circle.maxY));

    var points = [];
    for (var row = firstRow; row <= lastRow; row++) {
        var dy = midRow - row;
        var dx = Math.sqrt(circle.radius * circle.radius - dy * dy);
        var firstCol = Math.max(0, roundingMode.roundLeft(circle.centerX - dx));
        var lastCol = Math.min(grid.cols - 1, roundingMode.roundRight(circle.centerX + dx));
        for (var col = firstCol; col <= lastCol; col++) {
            points.push(gridUtils.getIndex(grid, row, col));
        }
    }

    return points;
};

convertFunctions["worm"] = function wormToGrid(worm, grid, roundingMode) {
    return convertFunctions["circle"]({
        centerX: worm.centerX,
        centerY: worm.centerY,
        x: worm.centerX - worm.radius,
        y: worm.centerY - worm.radius,
        maxX: worm.centerX + worm.radius,
        maxY: worm.centerY + worm.radius,
        radius: worm.radius
    }, grid, roundingMode);
};

function createRoundingMode(roundLeft, roundRight) {
    return { roundLeft: roundLeft, roundRight: roundRight };
}

var ShapeToGridConverter = module.exports = {};

ShapeToGridConverter.RoundingModes = {};
ShapeToGridConverter.RoundingModes.ROUND = createRoundingMode(Math.round, Math.round);
ShapeToGridConverter.RoundingModes.CONTAINMENT = createRoundingMode(Math.ceil, Math.floor);
ShapeToGridConverter.RoundingModes.INTERSECTION = createRoundingMode(Math.floor, Math.ceil);

ShapeToGridConverter.createShapeToGridConverter = function createShapeToGridConverter() {
    function convert(shape, grid, roundingMode) {
        var type = shape.type || "worm";
        var convertFunction = convertFunctions[type];

        roundingMode = roundingMode || ShapeToGridConverter.RoundingModes.ROUND;

        if (shape) return convertFunction(shape, grid, roundingMode);
    }

    return {
        convert: convert
    };
};

},{"./../util/grid.js":12}],7:[function(require,module,exports){
"use strict";

var shapeFactory = require("../shape-factory.js");
var shapeSpatialRelations = require("../shape-spatial-relations.js");

describe("Shape spatial relations", function () {

    it("should detect circle in rectangle", function () {
        var circle = shapeFactory.createCircle(2.8, 0.1, 0.1);
        var rectangle = shapeFactory.createRectangle(6, 6, 0, 0);
        expect(shapeSpatialRelations.contains(rectangle, circle)).toBeTruthy();
    });

    it("should not detect circle outside of rectangle", function () {
        var circle = shapeFactory.createCircle(3, 0.9, 0.9);
        var rectangle = shapeFactory.createRectangle(6, 6, 1, 1);
        expect(shapeSpatialRelations.contains(rectangle, circle)).toBeFalsy();
    });

    it("should detect rectangle in circle", function () {
        var rectangle1 = shapeFactory.createRectangle(6, 2, 1, 3);
        var rectangle2 = shapeFactory.createRectangle(4, 4, 2, 1);
        var circle = shapeFactory.createCircle(4, 0, 0);
        expect(shapeSpatialRelations.contains(circle, rectangle1)).toBeTruthy();
        expect(shapeSpatialRelations.contains(circle, rectangle2)).toBeTruthy();
    });

    it("should not detect rectangle outside of circle", function () {
        var rectangle = shapeFactory.createRectangle(5, 5, 2, 1);
        var circle = shapeFactory.createCircle(4, 0, 0);
        expect(shapeSpatialRelations.contains(circle, rectangle)).toBeFalsy();
    });
});

},{"../shape-factory.js":4,"../shape-spatial-relations.js":5}],8:[function(require,module,exports){
"use strict";

function followTrajectory(trajectory, time) {
    var percentage = time / trajectory.duration;
    percentage = Math.max(0, Math.min(1, percentage));
    var x = trajectory.startX + percentage * (trajectory.endX - trajectory.startX);
    var y = trajectory.startY + percentage * (trajectory.endY - trajectory.startY);
    var direction = trajectory.startDirection + percentage * (trajectory.endDirection - trajectory.startDirection);
    if (trajectory.type === "arc") {
        var arcAngle = trajectory.arcStartAngle + percentage * (trajectory.arcEndAngle - trajectory.arcStartAngle);
        x = trajectory.arcCenterX + trajectory.arcRadius * Math.cos(arcAngle);
        y = trajectory.arcCenterY + trajectory.arcRadius * Math.sin(arcAngle);
    }
    return { x: x, y: y, direction: direction };
}

function createTrajectory(_ref) {
    var startX = _ref.startX;
    var startY = _ref.startY;
    var startDirection = _ref.startDirection;
    var speed = _ref.speed;
    var turningVelocity = _ref.turningVelocity;
    var duration = _ref.duration;

    var trajectory = {
        duration: duration,
        startX: startX,
        startY: startY,
        startDirection: startDirection,
        speed: speed,
        turningVelocity: turningVelocity
    };

    var xDiff = 0;
    var yDiff = 0;
    if (speed === 0) {
        // 0 diameter arc
        trajectory.type = "still_arc";
        xDiff = 0;
        yDiff = 0;
    } else if (turningVelocity === 0) {
        // Straight line
        trajectory.type = "straight";
        xDiff = duration * speed * Math.cos(startDirection);
        yDiff = duration * speed * Math.sin(startDirection);
    } else {
        // Circle arc
        trajectory.type = "arc";
        var radius = speed / turningVelocity;
        var angle = duration * turningVelocity;

        trajectory.arcCenterX = trajectory.startX - radius * Math.cos(startDirection - Math.PI / 2);
        trajectory.arcCenterY = trajectory.startY - radius * Math.sin(startDirection - Math.PI / 2);
        trajectory.arcRadius = Math.abs(radius);
        trajectory.arcStartAngle = startDirection - radius / Math.abs(radius) * Math.PI / 2;
        trajectory.arcAngleDiff = angle;
        trajectory.arcEndAngle = trajectory.arcStartAngle + trajectory.arcAngleDiff;

        xDiff = -radius * (Math.cos(startDirection - Math.PI / 2) + Math.cos(startDirection + Math.PI / 2 + angle));
        yDiff = -radius * (Math.sin(startDirection - Math.PI / 2) + Math.sin(startDirection + Math.PI / 2 + angle));
    }
    trajectory.endX = trajectory.startX + xDiff;
    trajectory.endY = trajectory.startY + yDiff;
    trajectory.endDirection = trajectory.startDirection + turningVelocity * duration;
    return trajectory;
}

module.exports = {
    createTrajectory: createTrajectory,
    followTrajectory: followTrajectory
};

},{}],9:[function(require,module,exports){
"use strict";

var clone = require("./clone");

describe("clone", function () {

    it("test basic cloning", function () {
        var object = {
            1: {
                deepList: []
            },
            list: []
        };

        expect(clone(object)).toEqual(object);
    });

    it("test deep cloning", function () {
        var object = {
            1: {
                deepList: []
            },
            list: []
        };

        var clonedObject = clone(object);
        clonedObject.list.push(1);
        clonedObject[1].deepList.push(2);
        expect(object).toEqual({
            1: {
                deepList: []
            },
            list: []
        });

        expect(clonedObject).toEqual({
            1: {
                deepList: [2]
            },
            list: [1]
        });
    });
});

},{"./clone":10}],10:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

function isPrimitive(object) {
    return (typeof object === 'undefined' ? 'undefined' : _typeof(object)) !== 'object' || object === null || object === undefined;
}

module.exports = function clone(source) {

    if (Array.isArray(source)) {
        var clonedArray = [];
        source.forEach(function (item) {
            if (isPrimitive(item)) {
                clonedArray.push(item);
            } else {
                clonedArray.push(clone(item));
            }
        });
        return clonedArray;
    } else {
        var clonedObject = {};
        for (var prop in source) {
            if (source.hasOwnProperty(prop)) {
                var value = source[prop];
                if (isPrimitive(value)) {
                    clonedObject[prop] = value;
                } else {
                    clonedObject[prop] = clone(value);
                }
            }
        }

        return clonedObject;
    }
};

},{}],11:[function(require,module,exports){
"use strict";

module.exports = function forEach(collection, callback) {
    for (var k in collection) {
        if (collection.hasOwnProperty(k)) {
            callback(collection[k], k);
        }
    }
};

},{}],12:[function(require,module,exports){
"use strict";

var utils = module.exports = {};

utils.getIndex = function getIndex(grid, row, col) {
    return row * grid.cols + col;
};

utils.getRowCol = function getRowCol(grid, index) {
    var rowCol = {};
    rowCol.row = Math.floor(index / grid.cols);
    rowCol.col = index - rowCol.row * grid.cols;
    return rowCol;
};

utils.isInsideGrid = function isInsideGrid(grid, row, col) {
    return row >= 0 && row < grid.rows && col >= 0 && col < grid.cols;
};

},{}]},{},[2,7,9])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29yZS9jb25zdGFudHMuanMiLCJzcmMvY29yZS9nYW1lLXN0YXRlLWZ1bmN0aW9ucy1zcGVjLmpzIiwic3JjL2NvcmUvZ2FtZS1zdGF0ZS1mdW5jdGlvbnMuanMiLCJzcmMvY29yZS9nZW9tZXRyeS9zaGFwZS1mYWN0b3J5LmpzIiwic3JjL2NvcmUvZ2VvbWV0cnkvc2hhcGUtc3BhdGlhbC1yZWxhdGlvbnMuanMiLCJzcmMvY29yZS9nZW9tZXRyeS9zaGFwZS10by1ncmlkLWNvbnZlcnRlci5qcyIsInNyYy9jb3JlL2dlb21ldHJ5L3Rlc3Qvc2hhcGUtc3BhdGlhbC1yZWxhdGlvbnMtc3BlYy5qcyIsInNyYy9jb3JlL2dlb21ldHJ5L3RyYWplY3RvcnkvdHJhamVjdG9yeS11dGlsLmpzIiwic3JjL2NvcmUvdXRpbC9jbG9uZS1zcGVjLmpzIiwic3JjL2NvcmUvdXRpbC9jbG9uZS5qcyIsInNyYy9jb3JlL3V0aWwvZm9yLWVhY2guanMiLCJzcmMvY29yZS91dGlsL2dyaWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQUksZUFBZSxRQUFuQixBQUFtQixBQUFRO0FBQzNCLElBQUksVUFBVSxRQUFkLEFBQWMsQUFBUTs7QUFFdEIsSUFBSTtVQUFhLEFBQ1AsQUFDTjtVQUZhLEFBRVAsQUFDTjtXQUhhLEFBR04sQUFDUDtZQUphLEFBSUwsQUFDUjtZQUxhLEFBS0wsQUFDUjtVQU5hLEFBTVAsQUFDTjtZQVBhLEFBT0wsQUFDUjtVQVJhLEFBUVAsQUFDTjtXQVRhLEFBU04sQUFDUDtjQVZKLEFBQWlCLEFBVUg7QUFWRyxBQUNiO0FBV0osSUFBSSxlQUFKLEFBQW1CO0FBQ25CLFFBQUEsQUFBUSxZQUFZLFVBQUEsQUFBQyxPQUFELEFBQU8sSUFBUDtXQUFjLGFBQUEsQUFBYSxLQUEzQixBQUFjLEFBQWtCO0FBQXBEOztBQUVBLElBQUkscUJBQUosQUFB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QUFpQixZQUFqQixBQUE2QixVQUFVLEFBQ3BEO1NBQUssSUFBTCxBQUFTLEtBQVQsQUFBYyxZQUFZLEFBQ3RCO1lBQUksV0FBQSxBQUFXLGVBQWYsQUFBSSxBQUEwQixJQUFJLEFBQzlCO3FCQUFTLFdBQVQsQUFBUyxBQUFXLElBQXBCLEFBQXdCLEFBQzNCO0FBQ0o7QUFDSjtBQU5EOzs7OztBQ0FBLElBQUksUUFBUSxPQUFBLEFBQU8sVUFBbkIsQUFBNkI7O0FBRTdCLE1BQUEsQUFBTSxXQUFXLFNBQUEsQUFBUyxTQUFULEFBQWtCLE1BQWxCLEFBQXdCLEtBQXhCLEFBQTZCLEtBQUssQUFDL0M7V0FBTyxNQUFNLEtBQU4sQUFBVyxPQUFsQixBQUF5QixBQUM1QjtBQUZEOztBQUlBLE1BQUEsQUFBTSxZQUFZLFNBQUEsQUFBUyxVQUFULEFBQW1CLE1BQW5CLEFBQXlCLE9BQU8sQUFDOUM7UUFBSSxTQUFKLEFBQWEsQUFDYjtXQUFBLEFBQU8sTUFBTSxLQUFBLEFBQUssTUFBTSxRQUFRLEtBQWhDLEFBQWEsQUFBd0IsQUFDckM7V0FBQSxBQUFPLE1BQU0sUUFBUSxPQUFBLEFBQU8sTUFBTSxLQUFsQyxBQUF1QyxBQUN2QztXQUFBLEFBQU8sQUFDVjtBQUxEOztBQU9BLE1BQUEsQUFBTSxlQUFlLFNBQUEsQUFBUyxhQUFULEFBQXNCLE1BQXRCLEFBQTRCLEtBQTVCLEFBQWlDLEtBQUssQUFDdkQ7V0FBTyxPQUFBLEFBQU8sS0FBSyxNQUFNLEtBQWxCLEFBQXVCLFFBQVEsT0FBL0IsQUFBc0MsS0FBSyxNQUFNLEtBQXhELEFBQTZELEFBQ2hFO0FBRkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHNoYXBlRmFjdG9yeSA9IHJlcXVpcmUoXCIuL2dlb21ldHJ5L3NoYXBlLWZhY3RvcnkuanNcIik7XG52YXIgZm9yRWFjaCA9IHJlcXVpcmUoXCIuL3V0aWwvZm9yLWVhY2guanNcIik7XG5cbnZhciB3b3JtQ29sb3JzID0ge1xuICAgIGJsdWU6IFwiIzAzQTlGNFwiLFxuICAgIHBpbms6IFwiI0U5MUU2M1wiLFxuICAgIGdyZWVuOiBcIiM0Q0FGNTBcIixcbiAgICBwdXJwbGU6IFwiIzlDMjdCMFwiLFxuICAgIG9yYW5nZTogXCIjRkY5ODAwXCIsXG4gICAgbGltZTogXCIjQ0REQzM5XCIsXG4gICAgaW5kaWdvOiBcIiMzRjUxQjVcIixcbiAgICB0ZWFsOiBcIiMwMDk2ODhcIixcbiAgICBibGFjazogXCIjNDQ0XCIsXG4gICAgYmx1ZWdyZXk6IFwiIzYwN0Q4QlwiXG59O1xudmFyIHdvcm1Db2xvcklkcyA9IFtdO1xuZm9yRWFjaCh3b3JtQ29sb3JzLCAoY29sb3IsaWQpID0+IHdvcm1Db2xvcklkcy5wdXNoKGlkKSk7XG5cbnZhciBwb3dlclVwRGVmaW5pdGlvbnMgPSB7fTtcbnBvd2VyVXBEZWZpbml0aW9uc1tcInNwZWVkXCJdID0ge1xuICAgIG5hbWU6IFwic3BlZWRcIixcbiAgICBlZmZlY3RUeXBlOiBcInNwZWVkXCIsXG4gICAgZWZmZWN0RHVyYXRpb246IDUsXG4gICAgZWZmZWN0U3RyZW5ndGg6IDMgLyAyLFxuICAgIHdlaWdodGVkU3Bhd25DaGFuY2U6IDEsXG4gICAgYWZmZWN0czogXCJzZWxmXCJcbn07XG5wb3dlclVwRGVmaW5pdGlvbnNbXCJzbG93XCJdID0ge1xuICAgIG5hbWU6IFwic2xvd1wiLFxuICAgIGVmZmVjdFR5cGU6IFwic3BlZWRcIixcbiAgICBlZmZlY3REdXJhdGlvbjogNSxcbiAgICBlZmZlY3RTdHJlbmd0aDogMiAvIDMsXG4gICAgd2VpZ2h0ZWRTcGF3bkNoYW5jZTogMSxcbiAgICBhZmZlY3RzOiBcIm90aGVyc1wiXG59O1xucG93ZXJVcERlZmluaXRpb25zW1wiZmF0XCJdID0ge1xuICAgIG5hbWU6IFwiZmF0XCIsXG4gICAgZWZmZWN0VHlwZTogXCJzaXplXCIsXG4gICAgZWZmZWN0RHVyYXRpb246IDUsXG4gICAgZWZmZWN0U3RyZW5ndGg6IDIsXG4gICAgd2VpZ2h0ZWRTcGF3bkNoYW5jZTogMSxcbiAgICBhZmZlY3RzOiBcIm90aGVyc1wiXG59O1xucG93ZXJVcERlZmluaXRpb25zW1wic2xpbVwiXSA9IHtcbiAgICBuYW1lOiBcInNsaW1cIixcbiAgICBlZmZlY3RUeXBlOiBcInNpemVcIixcbiAgICBlZmZlY3REdXJhdGlvbjogNSxcbiAgICBlZmZlY3RTdHJlbmd0aDogMC41LFxuICAgIHdlaWdodGVkU3Bhd25DaGFuY2U6IDEsXG4gICAgYWZmZWN0czogXCJzZWxmXCJcbn07XG5wb3dlclVwRGVmaW5pdGlvbnNbXCJxdWlja190dXJuXCJdID0ge1xuICAgIG5hbWU6IFwicXVpY2tfdHVyblwiLFxuICAgIGVmZmVjdFR5cGU6IFwidHVybmluZ1NwZWVkXCIsXG4gICAgZWZmZWN0RHVyYXRpb246IDUsXG4gICAgZWZmZWN0U3RyZW5ndGg6IDMgLyAyLFxuICAgIHdlaWdodGVkU3Bhd25DaGFuY2U6IDEsXG4gICAgYWZmZWN0czogXCJzZWxmXCJcbn07XG5wb3dlclVwRGVmaW5pdGlvbnNbXCJzbG93X3R1cm5cIl0gPSB7XG4gICAgbmFtZTogXCJzbG93X3R1cm5cIixcbiAgICBlZmZlY3RUeXBlOiBcInR1cm5pbmdTcGVlZFwiLFxuICAgIGVmZmVjdER1cmF0aW9uOiA1LFxuICAgIGVmZmVjdFN0cmVuZ3RoOiAyIC8gMyxcbiAgICB3ZWlnaHRlZFNwYXduQ2hhbmNlOiAxLFxuICAgIGFmZmVjdHM6IFwib3RoZXJzXCJcbn07XG5wb3dlclVwRGVmaW5pdGlvbnNbXCJzd2l0Y2hhcm9vbmllXCJdID0ge1xuICAgIG5hbWU6IFwic3dpdGNoYXJvb25pZVwiLFxuICAgIGVmZmVjdFR5cGU6IFwid29ybVN3aXRjaFwiLFxuICAgIHdlaWdodGVkU3Bhd25DaGFuY2U6IDEwMDAuNSxcbiAgICBhZmZlY3RzOiBcImFsbFwiXG59O1xucG93ZXJVcERlZmluaXRpb25zW1wia2V5X3N3aXRjaFwiXSA9IHtcbiAgICBuYW1lOiBcImtleV9zd2l0Y2hcIixcbiAgICBlZmZlY3RUeXBlOiBcInR1cm5pbmdTcGVlZFwiLFxuICAgIGVmZmVjdER1cmF0aW9uOiA1LFxuICAgIGVmZmVjdFN0cmVuZ3RoOiAtMSxcbiAgICB3ZWlnaHRlZFNwYXduQ2hhbmNlOiAxLFxuICAgIGFmZmVjdHM6IFwib3RoZXJzXCJcbn07XG5wb3dlclVwRGVmaW5pdGlvbnNbXCJkcnVua1wiXSA9IHtcbiAgICBuYW1lOiBcImRydW5rXCIsXG4gICAgZWZmZWN0VHlwZTogXCJkcnVua1wiLFxuICAgIGVmZmVjdER1cmF0aW9uOiA1LFxuICAgIGVmZmVjdFN0cmVuZ3RoOiAxLFxuICAgIHdlaWdodGVkU3Bhd25DaGFuY2U6IDEsXG4gICAgYWZmZWN0czogXCJvdGhlcnNcIlxufTtcbnBvd2VyVXBEZWZpbml0aW9uc1tcImNsZWFyX2FsbFwiXSA9IHtcbiAgICBuYW1lOiBcImNsZWFyXCIsXG4gICAgZWZmZWN0VHlwZTogXCJjbGVhclwiLFxuICAgIHdlaWdodGVkU3Bhd25DaGFuY2U6IDEwMDAuMjUsXG4gICAgYWZmZWN0czogXCJhbGxcIlxufTtcbnBvd2VyVXBEZWZpbml0aW9uc1tcImNsZWFyX3NlbGZcIl0gPSB7XG4gICAgbmFtZTogXCJjbGVhclwiLFxuICAgIGVmZmVjdFR5cGU6IFwiY2xlYXJcIixcbiAgICB3ZWlnaHRlZFNwYXduQ2hhbmNlOiAxMDAwLjI1LFxuICAgIGFmZmVjdHM6IFwic2VsZlwiXG59O1xucG93ZXJVcERlZmluaXRpb25zW1wiY2xlYXJfb3RoZXJzXCJdID0ge1xuICAgIG5hbWU6IFwiY2xlYXJcIixcbiAgICBlZmZlY3RUeXBlOiBcImNsZWFyXCIsXG4gICAgd2VpZ2h0ZWRTcGF3bkNoYW5jZTogMTAwMC4yNSxcbiAgICBhZmZlY3RzOiBcIm90aGVyc1wiXG59O1xucG93ZXJVcERlZmluaXRpb25zW1wic3VwZXJfanVtcFwiXSA9IHtcbiAgICBuYW1lOiBcInN1cGVyX2p1bXBcIixcbiAgICBlZmZlY3RUeXBlOiBcInN1cGVySnVtcFwiLFxuICAgIGVmZmVjdER1cmF0aW9uOiA1LFxuICAgIHdlaWdodGVkU3Bhd25DaGFuY2U6IDEsXG4gICAgYWZmZWN0czogXCJzZWxmXCJcbn07XG5wb3dlclVwRGVmaW5pdGlvbnNbXCJ0cm9uX3R1cm5cIl0gPSB7XG4gICAgbmFtZTogXCJ0cm9uX3R1cm5cIixcbiAgICBlZmZlY3RUeXBlOiBcInRyb25UdXJuXCIsXG4gICAgZWZmZWN0RHVyYXRpb246IDUsXG4gICAgd2VpZ2h0ZWRTcGF3bkNoYW5jZTogMSxcbiAgICBhZmZlY3RzOiBcIm90aGVyc1wiXG59O1xucG93ZXJVcERlZmluaXRpb25zW1widHdpblwiXSA9IHtcbiAgICBuYW1lOiBcInR3aW5cIixcbiAgICBlZmZlY3RUeXBlOiBcInR3aW5cIixcbiAgICBlZmZlY3REdXJhdGlvbjogNSxcbiAgICB3ZWlnaHRlZFNwYXduQ2hhbmNlOiAxLFxuICAgIGFmZmVjdHM6IFwic2VsZlwiXG59O1xuXG5wb3dlclVwRGVmaW5pdGlvbnNbXCJ3YWxsX2hhY2tfc2VsZlwiXSA9IHtcbiAgICBuYW1lOiBcIndhbGxfaGFja1wiLFxuICAgIGVmZmVjdFR5cGU6IFwid2FsbEhhY2tcIixcbiAgICBlZmZlY3REdXJhdGlvbjogNSxcbiAgICB3ZWlnaHRlZFNwYXduQ2hhbmNlOiAwLjUsXG4gICAgYWZmZWN0czogXCJzZWxmXCJcbn07XG5cbnBvd2VyVXBEZWZpbml0aW9uc1tcIndhbGxfaGFja19hbGxcIl0gPSB7XG4gICAgbmFtZTogXCJ3YWxsX2hhY2tcIixcbiAgICBlZmZlY3RUeXBlOiBcIndhbGxIYWNrXCIsXG4gICAgZWZmZWN0RHVyYXRpb246IDUsXG4gICAgd2VpZ2h0ZWRTcGF3bkNoYW5jZTogMC41LFxuICAgIGFmZmVjdHM6IFwiYWxsXCJcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIFNUQVJUX1BIQVNFX0RVUkFUSU9OOiAyLjUsXG4gICAgU1RBUlRfRElTVEFOQ0VfVE9fTUFQOiA1MCxcbiAgICBTVEFSVF9ESVNUQU5DRV9UT19XT1JNUzogNzAsXG5cbiAgICB3b3JtQ29sb3JzLFxuICAgIHdvcm1Db2xvcklkcyxcblxuICAgIHBvd2VyVXBEZWZpbml0aW9ucyxcbiAgICBQT1dFUl9VUF9TUEFXTl9DSEFOQ0U6IDAuMTIsICAgICAgICAgICAgLy8gSW52ZXJzZSBvZiBtYXhpbXVtIHRpbWUgYmV0d2VlbiBwb3dlciB1cCBzcGF3bnMgKHNlY29uZHMpLiAwLjEgbWVhbnMgbWF4IDEwIHNlY29uZHMsIGF2ZXJhZ2UgNSBzZWNvbmRzLlxuICAgIFBPV0VSX1VQX1NIQVBFOiBzaGFwZUZhY3RvcnkuY3JlYXRlQ2lyY2xlKDI1KSxcblxuICAgIFdPUk1fUkFESVVTOiA0LFxuICAgIFdPUk1fU1BFRUQ6IDkwLFxuICAgIFdPUk1fVFVSTklOR19TUEVFRDogMyxcblxuICAgIEpVTVBfQ09PTERPV046IDEuNSwgICAgICAgICAgICAgICAgLy8gQWZ0ZXIgYSBqdW1wLCB0aGlzIGlzIHRoZSBtaW5pbXVtIHdhaXRpbmcgdGltZSB1bnRpbCBhbm90aGVyIGp1bXBcbiAgICBKVU1QX0xFTkdUSDogMzAsICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIGxlbmd0aCBvZiBhIGp1bXBcbiAgICBKVU1QX0NIQU5DRTogMC40LCAgICAgICAgICAgICAgICAgICAgICAgLy8gMC41IG1lYW5zIDUwICUgY2hhbmNlIG9mIGp1bXAgYWZ0ZXIgMSBzZWNvbmQgaGFzIHBhc3NlZCAoYWZ0ZXIgdGhlIEpVTVBfQ09PTERPV04gaGFzIHBhc3NlZCkuXG5cbiAgICBJTU1VTklUWV9ESVNUQU5DRV9NVUxUSVBMSUVSOiA2LFxuXG4gICAgU1RFRVJJTkdfU1RSQUlHSFQ6IDAsXG4gICAgU1RFRVJJTkdfTEVGVDogLTEsXG4gICAgU1RFRVJJTkdfUklHSFQ6IDEsXG5cbiAgICBQTEFZX0FSRUFfRlJFRTogLTEsXG4gICAgUExBWV9BUkVBX09CU1RBQ0xFOiAtMlxufTsiLCJ2YXIgZ3NmID0gcmVxdWlyZShcIi4vZ2FtZS1zdGF0ZS1mdW5jdGlvbnMuanNcIik7XG5cbi8vamFzbWluZS5wcCA9IGZ1bmN0aW9uIChvYmopIHtcbi8vICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmosIHVuZGVmaW5lZCwgMik7XG4vL307XG5cbmRlc2NyaWJlKFwiZ2FtZS1zdGF0ZS1mdW5jdGlvbnNcIiwgZnVuY3Rpb24gKCkge1xuXG4gICAgaXQoXCJnZXRQbGF5ZXJcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBleHBlY3QoKCkgPT4gZ3NmLmdldFBsYXllcihnc2YuY3JlYXRlR2FtZVN0YXRlKHt9KSkpLnRvVGhyb3coKTtcbiAgICAgICAgZXhwZWN0KCgpID0+IGdzZi5nZXRQbGF5ZXIoZ3NmLmNyZWF0ZUdhbWVTdGF0ZSh7fSksIFwiMFwiKSkudG9UaHJvdygpO1xuXG4gICAgICAgIGV4cGVjdChnc2YuZ2V0UGxheWVyKGdzZi5jcmVhdGVHYW1lU3RhdGUoe3BsYXllcnM6IFt7aWQ6IFwiMFwifV19KSwgXCIwXCIpKS50b0VxdWFsKHtpZDogXCIwXCJ9KTtcbiAgICAgICAgZXhwZWN0KGdzZi5nZXRQbGF5ZXIoZ3NmLmNyZWF0ZUdhbWVTdGF0ZSh7cGxheWVyczogW3tpZDogXCIwXCJ9XSwgd29ybXM6IFt7aWQ6IFwiMVwiLCBwbGF5ZXJJZDogXCIwXCJ9XX0pLCBcIjFcIikpLnRvRXF1YWwoe2lkOiBcIjBcIn0pO1xuICAgICAgICBleHBlY3QoZ3NmLmdldFBsYXllcihnc2YuY3JlYXRlR2FtZVN0YXRlKHtwbGF5ZXJzOiBbe2lkOiBcIjBcIn1dLCB3b3JtczogW3tpZDogXCIxXCIsIHBsYXllcklkOiBcIjBcIn1dfSksIFwiMVwiKSkudG9FcXVhbCh7aWQ6IFwiMFwifSk7XG4gICAgICAgIGV4cGVjdChnc2YuZ2V0UGxheWVyKGdzZi5jcmVhdGVHYW1lU3RhdGUoe3BsYXllcnM6IFt7aWQ6IFwiMFwifV0sIHdvcm1QYXRoU2VnbWVudHM6IHtcIjFcIjogW3twbGF5ZXJJZDogXCIwXCJ9XX19KSwgXCIxXCIpKS50b0VxdWFsKHtpZDogXCIwXCJ9KTtcbiAgICB9KTtcblxuICAgIGl0KFwiYWRkV29ybVBhdGhTZWdtZW50TWV0YURhdGFcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZ2FtZVN0YXRlID0gZ3NmLmNyZWF0ZVNpbXBsZUdhbWVTdGF0ZSh7XG4gICAgICAgICAgICB3b3JtUGF0aFNlZ21lbnRzOiB7XG4gICAgICAgICAgICAgICAgMDogW1xuICAgICAgICAgICAgICAgICAgICB7c29tZVZhbHVlOiBcInNvbWV0aGluZ1wiLCBtZXRhRGF0YTogW119XVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZ3NmLmFkZFdvcm1QYXRoU2VnbWVudE1ldGFEYXRhKGdhbWVTdGF0ZSwgMCwge3R5cGU6IFwiY2xlYXJcIn0sIGZhbHNlKTtcbiAgICAgICAgZXhwZWN0KGdhbWVTdGF0ZSkudG9FcXVhbCh7XG4gICAgICAgICAgICB3b3JtUGF0aFNlZ21lbnRzOiB7XG4gICAgICAgICAgICAgICAgMDogW1xuICAgICAgICAgICAgICAgICAgICB7c29tZVZhbHVlOiBcInNvbWV0aGluZ1wiLCBtZXRhRGF0YTogW3t0eXBlOiBcImNsZWFyXCJ9XX1dXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGdhbWVTdGF0ZSA9IGdzZi5jcmVhdGVTaW1wbGVHYW1lU3RhdGUoe1xuICAgICAgICAgICAgZ2FtZVRpbWU6IDIwMCxcbiAgICAgICAgICAgIHdvcm1QYXRoU2VnbWVudHM6IHtcbiAgICAgICAgICAgICAgICAwOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAwLjkwMjAwMDAwMDAwMDAwMDYsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydFg6IDQ1NC4xMDIxNTg2NjUwMDI5LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRZOiAxMDkuNjczODI3NDYwNjI5MTEsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydERpcmVjdGlvbjogMTIuMzMzOTcxNzM5MjU0OTg4LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3BlZWQ6IDkwLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHVybmluZ1ZlbG9jaXR5OiAzLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJhcmNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyY0NlbnRlclg6IDQ2MS4wMTE1MzU3NDczMDc3LFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJjQ2VudGVyWTogMTM4Ljg2NzMyODU5MjQ2NTMsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmNSYWRpdXM6IDMwLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJjU3RhcnRBbmdsZTogMTAuNzYzMTc1NDEyNDYwMDkxLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJjQW5nbGVEaWZmOiAyLjcwNjAwMDAwMDAwMDAwMTMsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmNFbmRBbmdsZTogMTMuNDY5MTc1NDEyNDYwMDk4LFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kWDogNDc5LjU5Mzg0OTMxNDk2LFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kWTogMTYyLjQxOTM0ODA5MTI5ODY0LFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kRGlyZWN0aW9uOiAxNS4wMzk5NzE3MzkyNTQ5OTUsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydFRpbWU6IDI2Ljc2MTk5OTk5OTk5OTM1LFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kVGltZTogMjcuNjYzOTk5OTk5OTk5MzEyLFxuICAgICAgICAgICAgICAgICAgICAgICAganVtcDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaXplOiA0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVySWQ6IFwicGxheWVyXzFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvcm1JZDogXCJ3b3JtXzBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGFEYXRhOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4OiAwXG4gICAgICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGdzZi5hZGRXb3JtUGF0aFNlZ21lbnRNZXRhRGF0YShnYW1lU3RhdGUsIDAsIHt0eXBlOiBcImNsZWFyXCJ9LCB0cnVlKTtcbiAgICAgICAgZXhwZWN0KGdhbWVTdGF0ZSkudG9FcXVhbCh7XG4gICAgICAgICAgICBnYW1lVGltZTogMjAwLFxuICAgICAgICAgICAgd29ybVBhdGhTZWdtZW50czoge1xuICAgICAgICAgICAgICAgIDA6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDAuOTAyMDAwMDAwMDAwMDAwNixcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0WDogNDU0LjEwMjE1ODY2NTAwMjksXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydFk6IDEwOS42NzM4Mjc0NjA2MjkxMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0RGlyZWN0aW9uOiAxMi4zMzM5NzE3MzkyNTQ5ODgsXG4gICAgICAgICAgICAgICAgICAgICAgICBzcGVlZDogOTAsXG4gICAgICAgICAgICAgICAgICAgICAgICB0dXJuaW5nVmVsb2NpdHk6IDMsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImFyY1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJjQ2VudGVyWDogNDYxLjAxMTUzNTc0NzMwNzcsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmNDZW50ZXJZOiAxMzguODY3MzI4NTkyNDY1MyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyY1JhZGl1czogMzAsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmNTdGFydEFuZ2xlOiAxMC43NjMxNzU0MTI0NjAwOTEsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmNBbmdsZURpZmY6IDIuNzA2MDAwMDAwMDAwMDAxMyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyY0VuZEFuZ2xlOiAxMy40NjkxNzU0MTI0NjAwOTgsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRYOiA0NzkuNTkzODQ5MzE0OTYsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRZOiAxNjIuNDE5MzQ4MDkxMjk4NjQsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmREaXJlY3Rpb246IDE1LjAzOTk3MTczOTI1NDk5NSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VGltZTogMjYuNzYxOTk5OTk5OTk5MzUsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRUaW1lOiAyNy42NjM5OTk5OTk5OTkzMTIsXG4gICAgICAgICAgICAgICAgICAgICAgICBqdW1wOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpemU6IDQsXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXJJZDogXCJwbGF5ZXJfMVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgd29ybUlkOiBcIndvcm1fMFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0YURhdGE6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXg6IDBcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydFg6IDQ3OS41OTM4NDkzMTQ5NixcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0WTogMTYyLjQxOTM0ODA5MTI5ODY0LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnREaXJlY3Rpb246IDE1LjAzOTk3MTczOTI1NDk5NSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwZWVkOiA5MCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR1cm5pbmdWZWxvY2l0eTogMyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYXJjXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmNDZW50ZXJYOiA0NjEuMDExNTM1NzQ3MzA3OTYsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmNDZW50ZXJZOiAxMzguODY3MzI4NTkyNDY0NjQsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmNSYWRpdXM6IDMwLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJjU3RhcnRBbmdsZTogMTMuNDY5MTc1NDEyNDYwMDk4LFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJjQW5nbGVEaWZmOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJjRW5kQW5nbGU6IDEzLjQ2OTE3NTQxMjQ2MDA5OCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZFg6IDQ3OS41OTM4NDkzMTQ5NTk5LFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kWTogMTYyLjQxOTM0ODA5MTI5ODY3LFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kRGlyZWN0aW9uOiAxNS4wMzk5NzE3MzkyNTQ5OTUsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydFRpbWU6IDIwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZFRpbWU6IDIwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGp1bXA6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZTogNCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllcklkOiBcInBsYXllcl8xXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB3b3JtSWQ6IFwid29ybV8wXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRhRGF0YTogW3t0eXBlOiBcImNsZWFyXCJ9XSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4OiAxXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRYOiA0NzkuNTkzODQ5MzE0OTYsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydFk6IDE2Mi40MTkzNDgwOTEyOTg2NCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0RGlyZWN0aW9uOiAxNS4wMzk5NzE3MzkyNTQ5OTUsXG4gICAgICAgICAgICAgICAgICAgICAgICBzcGVlZDogOTAsXG4gICAgICAgICAgICAgICAgICAgICAgICB0dXJuaW5nVmVsb2NpdHk6IDMsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImFyY1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJjQ2VudGVyWDogNDYxLjAxMTUzNTc0NzMwNzk2LFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJjQ2VudGVyWTogMTM4Ljg2NzMyODU5MjQ2NDY0LFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJjUmFkaXVzOiAzMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyY1N0YXJ0QW5nbGU6IDEzLjQ2OTE3NTQxMjQ2MDA5OCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyY0FuZ2xlRGlmZjogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyY0VuZEFuZ2xlOiAxMy40NjkxNzU0MTI0NjAwOTgsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRYOiA0NzkuNTkzODQ5MzE0OTU5OSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZFk6IDE2Mi40MTkzNDgwOTEyOTg2NyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZERpcmVjdGlvbjogMTUuMDM5OTcxNzM5MjU0OTk1LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lOiAyMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRUaW1lOiAyMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBqdW1wOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpemU6IDQsXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXJJZDogXCJwbGF5ZXJfMVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgd29ybUlkOiBcIndvcm1fMFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0YURhdGE6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXg6IDJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTsiLCJ2YXIgY29uc3RhbnRzID0gcmVxdWlyZShcIi4vY29uc3RhbnRzLmpzXCIpO1xudmFyIHNoYXBlRmFjdG9yeSA9IHJlcXVpcmUoXCIuL2dlb21ldHJ5L3NoYXBlLWZhY3RvcnkuanNcIik7XG52YXIgc2hhcGVUb0dyaWRDb252ZXJ0ZXIgPSByZXF1aXJlKFwiLi9nZW9tZXRyeS9zaGFwZS10by1ncmlkLWNvbnZlcnRlci5qc1wiKS5jcmVhdGVTaGFwZVRvR3JpZENvbnZlcnRlcigpO1xudmFyIGZvckVhY2ggPSByZXF1aXJlKFwiLi91dGlsL2Zvci1lYWNoLmpzXCIpO1xudmFyIHRyYWplY3RvcnlVdGlsID0gcmVxdWlyZShcIi4vZ2VvbWV0cnkvdHJhamVjdG9yeS90cmFqZWN0b3J5LXV0aWwuanNcIik7XG52YXIgY2xvbmUgPSByZXF1aXJlKFwiLi91dGlsL2Nsb25lLmpzXCIpO1xuXG5mdW5jdGlvbiBhZGRFZmZlY3QoZ2FtZVN0YXRlLCBlZmZlY3QpIHtcbiAgICBlZmZlY3QuaWQgPSBnZXROZXh0SWQoZ2FtZVN0YXRlLCBcImVmZmVjdFwiKTtcbiAgICBnYW1lU3RhdGUuZWZmZWN0cy5wdXNoKGVmZmVjdCk7XG4gICAgZ2FtZVN0YXRlLmVmZmVjdEV2ZW50cy5wdXNoKHtcbiAgICAgICAgdHlwZTogXCJzcGF3blwiLFxuICAgICAgICB0aW1lOiBnYW1lU3RhdGUuZ2FtZVRpbWUsXG4gICAgICAgIGVmZmVjdDogZWZmZWN0XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZFBsYXllcihnYW1lU3RhdGUsIHtjbGllbnRJZCwgaWQ9Z2V0TmV4dElkKFwicGxheWVyXCIpfSkge1xuICAgIGdhbWVTdGF0ZS5wbGF5ZXJzLnB1c2goe1xuICAgICAgICBpZCxcbiAgICAgICAgY2xpZW50SWQsXG4gICAgICAgIGFsaXZlOiB0cnVlLFxuICAgICAgICBzdGVlcmluZzogY29uc3RhbnRzLlNURUVSSU5HX1NUUkFJR0hULFxuICAgICAgICBnYW1lVGltZVdoZW5TdGVlcmluZ0NoYW5nZWQ6IDBcbiAgICB9KTtcbiAgICBnYW1lU3RhdGUucGxheWVyU3RlZXJpbmdTZWdtZW50c1tpZF0gPSBbXTtcbn1cblxuZnVuY3Rpb24gYWRkUGxheWVyU3RlZXJpbmdTZWdtZW50KGdhbWVTdGF0ZSwgcGxheWVySWQsIHN0ZWVyaW5nLCBkdXJhdGlvbikge1xuICAgIHZhciBzdGVlcmluZ1NlZ21lbnRzID0gZ2FtZVN0YXRlLnBsYXllclN0ZWVyaW5nU2VnbWVudHNbcGxheWVySWRdO1xuICAgIGlmIChzdGVlcmluZ1NlZ21lbnRzLmxlbmd0aCA+IDAgJiYgc3RlZXJpbmdTZWdtZW50c1tzdGVlcmluZ1NlZ21lbnRzLmxlbmd0aCAtIDFdLnN0ZWVyaW5nID09PSBzdGVlcmluZykge1xuICAgICAgICBzdGVlcmluZ1NlZ21lbnRzW3N0ZWVyaW5nU2VnbWVudHMubGVuZ3RoIC0gMV0uZHVyYXRpb24gKz0gZHVyYXRpb247XG4gICAgfSBlbHNlIHtcbiAgICAgICAgc3RlZXJpbmdTZWdtZW50cy5wdXNoKHtcbiAgICAgICAgICAgIHN0ZWVyaW5nOiBzdGVlcmluZyxcbiAgICAgICAgICAgIHN0YXJ0VGltZTogZ2FtZVN0YXRlLmdhbWVUaW1lIC0gZHVyYXRpb24sXG4gICAgICAgICAgICBkdXJhdGlvbjogZHVyYXRpb25cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBhZGRQb3dlclVwKGdhbWVTdGF0ZSwgcG93ZXJVcCkge1xuICAgIHBvd2VyVXAuaWQgPSBnZXROZXh0SWQoZ2FtZVN0YXRlLCBcInBvd2VyLXVwXCIpO1xuICAgIGdhbWVTdGF0ZS5wb3dlclVwcy5wdXNoKHBvd2VyVXApO1xuICAgIGdhbWVTdGF0ZS5wb3dlclVwRXZlbnRzLnB1c2goe1xuICAgICAgICB0eXBlOiBcInNwYXduXCIsXG4gICAgICAgIHRpbWU6IGdhbWVTdGF0ZS5nYW1lVGltZSxcbiAgICAgICAgcG93ZXJVcDogcG93ZXJVcFxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGFkZFdvcm0oZ2FtZVN0YXRlLCB7aWQ9Z2V0TmV4dElkKGdhbWVTdGF0ZSwgXCJ3b3JtXCIpLCBwbGF5ZXJJZCwgZGlyZWN0aW9uPTAsIGNlbnRlclgsIGNlbnRlclksIHJhZGl1cz1jb25zdGFudHMuV09STV9SQURJVVMsIHNwZWVkPWNvbnN0YW50cy5XT1JNX1NQRUVELCB0dXJuaW5nU3BlZWQ9Y29uc3RhbnRzLldPUk1fVFVSTklOR19TUEVFRCwgZGlzdGFuY2VUcmF2ZWxsZWQ9MCwgZGlzdGFuY2VUcmF2ZWxsZWRGcm9tQ2VsbHM9e319KSB7XG4gICAgdmFyIHdvcm0gPSB7XG4gICAgICAgIGlkLFxuICAgICAgICBwbGF5ZXJJZCxcbiAgICAgICAgY2VudGVyWCxcbiAgICAgICAgY2VudGVyWSxcbiAgICAgICAgcmFkaXVzLFxuICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgIHNwZWVkLFxuICAgICAgICB0dXJuaW5nU3BlZWQsXG4gICAgICAgIGFsaXZlOiB0cnVlLFxuICAgICAgICBqdW1wOiB7XG4gICAgICAgICAgICByZW1haW5pbmdKdW1wVGltZTogMCxcbiAgICAgICAgICAgIHRpbWVTaW5jZUxhc3RKdW1wOiAwXG4gICAgICAgIH0sXG4gICAgICAgIGRpc3RhbmNlVHJhdmVsbGVkLFxuICAgICAgICBkaXN0YW5jZVRyYXZlbGxlZEZyb21DZWxsc1xuICAgIH07XG4gICAgZ2FtZVN0YXRlLndvcm1zLnB1c2god29ybSk7XG4gICAgcmV0dXJuIHdvcm07XG59XG5cbmZ1bmN0aW9uIGFkZFdvcm1QYXRoU2VnbWVudChnYW1lU3RhdGUsIGlkLCBzZWdtZW50LCBmb3JjZU5ld1NlZ21lbnQgPSBmYWxzZSkge1xuICAgIHZhciBzZWdtZW50cyA9IGdhbWVTdGF0ZS53b3JtUGF0aFNlZ21lbnRzW2lkXTtcbiAgICBpZiAoIXNlZ21lbnRzKSB7XG4gICAgICAgIHNlZ21lbnRzID0gZ2FtZVN0YXRlLndvcm1QYXRoU2VnbWVudHNbaWRdID0gW107XG4gICAgfVxuICAgIGlmIChzZWdtZW50LmluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gVGhpcyBzZWdtZW50IGhhcyBiZWVuIGFkZGVkIHRvIHRoZSBnYW1lU3RhdGUgYWxyZWFkeS4gUHJvYmFibHkgc2VudCBmcm9tIHNlcnZlciB0byBjbGllbnQgLy9UT0RPOiBWaWxsIHZpIHZlcmtsaWdlbiBoYSBzw6VudCBow6RyPyBLYW5za2Uga2FuIGbDpSBib3J0IGRldHRhIGZyw6VuIGNvcmUgb2NoIGbDtnJzw7ZrYSBtaW5pbWVyYSBzZXJ2ZXItcmVsYXRlcmFkZSBzYWtlci5cbiAgICAgICAgc2VnbWVudHNbc2VnbWVudC5pbmRleF0gPSBzZWdtZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChzZWdtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHNlZ21lbnQuaW5kZXggPSAwO1xuICAgICAgICAgICAgc2VnbWVudHMucHVzaChzZWdtZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBsYXN0U2VnbWVudCA9IHNlZ21lbnRzW3NlZ21lbnRzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgaWYgKCFmb3JjZU5ld1NlZ21lbnQgJiZcbiAgICAgICAgICAgICAgICBzZWdtZW50LnR5cGUgPT09IGxhc3RTZWdtZW50LnR5cGUgJiZcbiAgICAgICAgICAgICAgICBzZWdtZW50LnNwZWVkID09PSBsYXN0U2VnbWVudC5zcGVlZCAmJlxuICAgICAgICAgICAgICAgIHNlZ21lbnQudHVybmluZ1ZlbG9jaXR5ID09PSBsYXN0U2VnbWVudC50dXJuaW5nVmVsb2NpdHkgJiZcbiAgICAgICAgICAgICAgICBzZWdtZW50LnNpemUgPT09IGxhc3RTZWdtZW50LnNpemUgJiZcbiAgICAgICAgICAgICAgICBzZWdtZW50LnBsYXllcklkID09PSBsYXN0U2VnbWVudC5wbGF5ZXJJZCAmJlxuICAgICAgICAgICAgICAgIHNlZ21lbnQuanVtcCA9PT0gbGFzdFNlZ21lbnQuanVtcCAmJlxuICAgICAgICAgICAgICAgIHNlZ21lbnQuc3RhcnREaXJlY3Rpb24gPT09IGxhc3RTZWdtZW50LmVuZERpcmVjdGlvbiAmJlxuICAgICAgICAgICAgICAgIHNlZ21lbnQuc3RhcnRYID09PSBsYXN0U2VnbWVudC5lbmRYICYmXG4gICAgICAgICAgICAgICAgc2VnbWVudC5zdGFydFkgPT09IGxhc3RTZWdtZW50LmVuZFkpIHtcblxuICAgICAgICAgICAgICAgIC8vIENvbnRpbnVlIGxhc3Qgc2VnbWVudFxuICAgICAgICAgICAgICAgIGlmIChzZWdtZW50LnR5cGUgIT09IFwiY2xlYXJcIikge1xuICAgICAgICAgICAgICAgICAgICBsYXN0U2VnbWVudC5kdXJhdGlvbiArPSBzZWdtZW50LmR1cmF0aW9uO1xuICAgICAgICAgICAgICAgICAgICBsYXN0U2VnbWVudC5lbmRUaW1lICs9IHNlZ21lbnQuZHVyYXRpb247XG4gICAgICAgICAgICAgICAgICAgIGxhc3RTZWdtZW50LmVuZFggPSBzZWdtZW50LmVuZFg7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RTZWdtZW50LmVuZFkgPSBzZWdtZW50LmVuZFk7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RTZWdtZW50LmVuZERpcmVjdGlvbiA9IHNlZ21lbnQuZW5kRGlyZWN0aW9uO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2VnbWVudC50eXBlID09PSBcImFyY1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0U2VnbWVudC5hcmNFbmRBbmdsZSA9IHNlZ21lbnQuYXJjRW5kQW5nbGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0U2VnbWVudC5hcmNBbmdsZURpZmYgKz0gc2VnbWVudC5hcmNBbmdsZURpZmY7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFN0YXJ0IG5ldyBzZWdtZW50XG4gICAgICAgICAgICAgICAgc2VnbWVudC5pbmRleCA9IHNlZ21lbnRzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBzZWdtZW50cy5wdXNoKHNlZ21lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBhZGRXb3JtUGF0aFNlZ21lbnRNZXRhRGF0YShnYW1lU3RhdGUsIGlkLCBtZXRhRGF0YSwgc2luZ2xlUG9pbnRJblRpbWUpIHtcbiAgICB2YXIgc2VnbWVudCA9IGdldExhdGVzdFdvcm1QYXRoU2VnbWVudChnYW1lU3RhdGUsIGlkKTtcbiAgICBpZiAoc2luZ2xlUG9pbnRJblRpbWUpIHtcbiAgICAgICAgdmFyIHNpbmdsZVBvaW50SW5UaW1lU2VnbWVudCA9IHRyYWplY3RvcnlVdGlsLmNyZWF0ZVRyYWplY3Rvcnkoe1xuICAgICAgICAgICAgZHVyYXRpb246IDAsXG4gICAgICAgICAgICBzdGFydFg6IHNlZ21lbnQuZW5kWCxcbiAgICAgICAgICAgIHN0YXJ0WTogc2VnbWVudC5lbmRZLFxuICAgICAgICAgICAgc3RhcnREaXJlY3Rpb246IHNlZ21lbnQuZW5kRGlyZWN0aW9uLFxuICAgICAgICAgICAgc3BlZWQ6IHNlZ21lbnQuc3BlZWQsXG4gICAgICAgICAgICB0dXJuaW5nVmVsb2NpdHk6IHNlZ21lbnQudHVybmluZ1ZlbG9jaXR5XG4gICAgICAgIH0pO1xuICAgICAgICBzaW5nbGVQb2ludEluVGltZVNlZ21lbnQuc3RhcnRUaW1lID0gZ2FtZVN0YXRlLmdhbWVUaW1lO1xuICAgICAgICBzaW5nbGVQb2ludEluVGltZVNlZ21lbnQuZW5kVGltZSA9IGdhbWVTdGF0ZS5nYW1lVGltZTtcbiAgICAgICAgc2luZ2xlUG9pbnRJblRpbWVTZWdtZW50Lmp1bXAgPSBzZWdtZW50Lmp1bXA7XG4gICAgICAgIHNpbmdsZVBvaW50SW5UaW1lU2VnbWVudC5zaXplID0gc2VnbWVudC5zaXplO1xuICAgICAgICBzaW5nbGVQb2ludEluVGltZVNlZ21lbnQucGxheWVySWQgPSBzZWdtZW50LnBsYXllcklkO1xuICAgICAgICBzaW5nbGVQb2ludEluVGltZVNlZ21lbnQud29ybUlkID0gc2VnbWVudC53b3JtSWQ7XG4gICAgICAgIHNpbmdsZVBvaW50SW5UaW1lU2VnbWVudC5tZXRhRGF0YSA9IGNsb25lKHNlZ21lbnQubWV0YURhdGEpO1xuICAgICAgICB2YXIgc2VnbWVudEFmdGVyID0gY2xvbmUoc2luZ2xlUG9pbnRJblRpbWVTZWdtZW50KTtcbiAgICAgICAgc2luZ2xlUG9pbnRJblRpbWVTZWdtZW50Lm1ldGFEYXRhLnB1c2gobWV0YURhdGEpO1xuICAgICAgICBhZGRXb3JtUGF0aFNlZ21lbnQoZ2FtZVN0YXRlLCBpZCwgc2luZ2xlUG9pbnRJblRpbWVTZWdtZW50LCB0cnVlKTtcbiAgICAgICAgYWRkV29ybVBhdGhTZWdtZW50KGdhbWVTdGF0ZSwgaWQsIHNlZ21lbnRBZnRlciwgdHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgc2VnbWVudC5tZXRhRGF0YS5wdXNoKG1ldGFEYXRhKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU1hcCh7IG5hbWUsIHNoYXBlLCBib3JkZXJXaWR0aD0wLCBibG9ja2luZ1NoYXBlcz1bXSB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgc2hhcGUsXG4gICAgICAgIGJvcmRlcldpZHRoLFxuICAgICAgICBibG9ja2luZ1NoYXBlcyxcbiAgICAgICAgd2lkdGg6IHNoYXBlLmJvdW5kaW5nQm94LndpZHRoICsgMiAqIGJvcmRlcldpZHRoLFxuICAgICAgICBoZWlnaHQ6IHNoYXBlLmJvdW5kaW5nQm94LmhlaWdodCArIDIgKiBib3JkZXJXaWR0aFxuICAgIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlTWFwQ2lyY2xlKHsgcmFkaXVzLCBuYW1lPVwiQ2lyY2xlIFwiICsgcmFkaXVzLCBib3JkZXJXaWR0aD0xMCwgYmxvY2tpbmdTaGFwZXM9W10gfSkge1xuICAgIHJldHVybiBjcmVhdGVNYXAoe1xuICAgICAgICBuYW1lLFxuICAgICAgICBzaGFwZTogc2hhcGVGYWN0b3J5LmNyZWF0ZUNpcmNsZShyYWRpdXMsIGJvcmRlcldpZHRoLCBib3JkZXJXaWR0aCksXG4gICAgICAgIGJvcmRlcldpZHRoLFxuICAgICAgICBibG9ja2luZ1NoYXBlc1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVNYXBSZWN0YW5nbGUoeyB3aWR0aCwgaGVpZ2h0LCBuYW1lPVwiUmVjdGFuZ2xlIFwiICsgd2lkdGggKyBcIiBcIiArIGhlaWdodCwgYm9yZGVyV2lkdGg9MTAsIGJsb2NraW5nU2hhcGVzPVtdIH0pIHtcbiAgICByZXR1cm4gY3JlYXRlTWFwKHtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgc2hhcGU6IHNoYXBlRmFjdG9yeS5jcmVhdGVSZWN0YW5nbGUod2lkdGgsIGhlaWdodCwgYm9yZGVyV2lkdGgsIGJvcmRlcldpZHRoKSxcbiAgICAgICAgYm9yZGVyV2lkdGgsXG4gICAgICAgIGJsb2NraW5nU2hhcGVzXG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU1hcFNxdWFyZSh7IHNpemUsIG5hbWU9XCJTcXVhcmUgXCIgKyBzaXplLCBib3JkZXJXaWR0aD0xMCwgYmxvY2tpbmdTaGFwZXM9W10gfSkge1xuICAgIHJldHVybiBjcmVhdGVNYXBSZWN0YW5nbGUoe1xuICAgICAgICBuYW1lLFxuICAgICAgICB3aWR0aDogc2l6ZSxcbiAgICAgICAgaGVpZ2h0OiBzaXplLFxuICAgICAgICBib3JkZXJXaWR0aCxcbiAgICAgICAgYmxvY2tpbmdTaGFwZXNcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gZm9yRWFjaEFsaXZlUGxheWVyKGdhbWVTdGF0ZSwgY2FsbGJhY2spIHtcbiAgICBnYW1lU3RhdGUucGxheWVycy5mb3JFYWNoKGZ1bmN0aW9uIChwbGF5ZXIpIHtcbiAgICAgICAgaWYgKHBsYXllci5hbGl2ZSkge1xuICAgICAgICAgICAgY2FsbGJhY2socGxheWVyKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBmb3JFYWNoQWxpdmVXb3JtKGdhbWVTdGF0ZSwgY2FsbGJhY2ssIHBsYXllcklkKSB7XG4gICAgZ2FtZVN0YXRlLndvcm1zLmZvckVhY2goZnVuY3Rpb24gKHdvcm0pIHtcbiAgICAgICAgaWYgKHdvcm0uYWxpdmUgJiYgKHBsYXllcklkID09PSB1bmRlZmluZWQgfHwgd29ybS5wbGF5ZXJJZCA9PT0gcGxheWVySWQpKSB7XG4gICAgICAgICAgICBjYWxsYmFjayh3b3JtKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBmb3JFYWNoQWxpdmVMYXRlc3RXb3JtUGF0aFNlZ21lbnQoZ2FtZVN0YXRlLCBjYWxsYmFjaywgcGxheWVySWQpIHtcbiAgICB2YXIgbGF0ZXN0U2VnbWVudHMgPSBbXTtcbiAgICBmb3JFYWNoKGdhbWVTdGF0ZS53b3JtUGF0aFNlZ21lbnRzLCBmdW5jdGlvbiAoc2VnbWVudHMpIHtcbiAgICAgICAgaWYgKHNlZ21lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxhdGVzdFNlZ21lbnRzLnB1c2goc2VnbWVudHNbc2VnbWVudHMubGVuZ3RoIC0gMV0pO1xuICAgIH0pO1xuICAgIGxhdGVzdFNlZ21lbnRzLmZvckVhY2goZnVuY3Rpb24gKGxhdGVzdFNlZ21lbnQpIHtcbiAgICAgICAgaWYgKGxhdGVzdFNlZ21lbnQuZW5kVGltZSAhPT0gZ2FtZVN0YXRlLmdhbWVUaW1lKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBpZiAoZ2V0V29ybShnYW1lU3RhdGUsIGxhdGVzdFNlZ21lbnQud29ybUlkKS5hbGl2ZSAmJiAocGxheWVySWQgPT09IHVuZGVmaW5lZCB8fCBsYXRlc3RTZWdtZW50LnBsYXllcklkID09PSBwbGF5ZXJJZCkpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGxhdGVzdFNlZ21lbnQpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldEFsaXZlUGxheWVycyhnYW1lU3RhdGUpIHtcbiAgICByZXR1cm4gZ2FtZVN0YXRlLnBsYXllcnMuZmlsdGVyKHAgPT4gcC5hbGl2ZSk7XG59XG5cbmZ1bmN0aW9uIGdldEFsaXZlV29ybXMoZ2FtZVN0YXRlLCBwbGF5ZXJJZCkge1xuICAgIHJldHVybiBnYW1lU3RhdGUud29ybXMuZmlsdGVyKHcgPT4gdy5hbGl2ZSAmJiAocGxheWVySWQgPT09IHVuZGVmaW5lZCB8fCB3LnBsYXllcklkID09PSBwbGF5ZXJJZCkpO1xufVxuXG5mdW5jdGlvbiBnZXRMYXRlc3RXb3JtUGF0aFNlZ21lbnQoZ2FtZVN0YXRlLCBzZWdtZW50SWQpIHtcbiAgICByZXR1cm4gZ2FtZVN0YXRlLndvcm1QYXRoU2VnbWVudHNbc2VnbWVudElkXVtnYW1lU3RhdGUud29ybVBhdGhTZWdtZW50c1tzZWdtZW50SWRdLmxlbmd0aCAtIDFdO1xufVxuXG5mdW5jdGlvbiBnZXRFZmZlY3QoZ2FtZVN0YXRlLCBlZmZlY3RJZCkge1xuICAgIHJldHVybiBnYW1lU3RhdGUuZWZmZWN0cy5maW5kKGUgPT4gZS5pZCA9PT0gZWZmZWN0SWQpO1xufVxuXG5mdW5jdGlvbiBnZXRBbGl2ZUVuZW15V29ybXMoZ2FtZXNTdGF0ZSwgd29ybUlkKSB7XG4gICAgcmV0dXJuIGdldEFsaXZlV29ybXMoZ2FtZXNTdGF0ZSkuZmlsdGVyKHcgPT4gdy5wbGF5ZXJJZCAhPT0gZ2V0V29ybShnYW1lc1N0YXRlLCB3b3JtSWQpLnBsYXllcklkKTtcbn1cblxuZnVuY3Rpb24gZ2V0UGxheWVyKGdhbWVTdGF0ZSwgaWQpIHtcbiAgICBpZiAoaWQgPT09IG51bGwgfHwgaWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJZCBtdXN0IGJlIHNldFwiKTtcbiAgICB9XG4gICAgdmFyIHBsYXllciA9IGdhbWVTdGF0ZS5wbGF5ZXJzLmZpbmQocCA9PiBwLmlkID09PSBpZCk7XG4gICAgaWYgKHBsYXllcikge1xuICAgICAgICByZXR1cm4gcGxheWVyO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciB3b3JtID0gZ2V0V29ybShnYW1lU3RhdGUsIGlkKTtcbiAgICAgICAgaWYgKHdvcm0pIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRQbGF5ZXIoZ2FtZVN0YXRlLCB3b3JtLnBsYXllcklkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRQbGF5ZXIoZ2FtZVN0YXRlLCBnZXRMYXRlc3RXb3JtUGF0aFNlZ21lbnQoZ2FtZVN0YXRlLCBpZCkucGxheWVySWQpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXRQb3dlclVwKGdhbWVTdGF0ZSwgcG93ZXJVcElkKSB7XG4gICAgcmV0dXJuIGdhbWVTdGF0ZS5wb3dlclVwcy5maW5kKHAgPT4gcC5pZCA9PT0gcG93ZXJVcElkKTtcbn1cblxuZnVuY3Rpb24gZ2V0V29ybShnYW1lU3RhdGUsIHdvcm1JZCkge1xuICAgIHJldHVybiBnYW1lU3RhdGUud29ybXMuZmluZCh3ID0+IHcuaWQgPT09IHdvcm1JZCk7XG59XG5cbmZ1bmN0aW9uIGdldFdvcm1FZmZlY3RzKGdhbWVTdGF0ZSwgd29ybUlkLCBlZmZlY3RUeXBlKSB7XG4gICAgdmFyIGVmZmVjdHMgPSBnYW1lU3RhdGUuZWZmZWN0cy5maWx0ZXIoZnVuY3Rpb24gKGVmZmVjdCkge1xuICAgICAgICByZXR1cm4gZWZmZWN0Lndvcm1JZCA9PT0gd29ybUlkO1xuICAgIH0pO1xuICAgIGlmIChlZmZlY3RUeXBlKSB7XG4gICAgICAgIHJldHVybiBlZmZlY3RzLmZpbHRlcihlID0+IGUudHlwZSA9PT0gZWZmZWN0VHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGVmZmVjdHM7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXRXb3JtRWZmZWN0KGdhbWVTdGF0ZSwgd29ybUlkLCBlZmZlY3RUeXBlKSB7XG4gICAgdmFyIGVmZmVjdHMgPSBnZXRXb3JtRWZmZWN0cyhnYW1lU3RhdGUsIHdvcm1JZCwgZWZmZWN0VHlwZSk7XG4gICAgcmV0dXJuIGVmZmVjdHMubGVuZ3RoICE9PSAwID8gZWZmZWN0c1swXSA6IG51bGw7XG59XG5cbmZ1bmN0aW9uIGhhc1dvcm1FZmZlY3QoZ2FtZVN0YXRlLCB3b3JtSWQsIGVmZmVjdFR5cGUpIHtcbiAgICByZXR1cm4gZ2V0V29ybUVmZmVjdHMoZ2FtZVN0YXRlLCB3b3JtSWQsIGVmZmVjdFR5cGUpLmxlbmd0aCA+IDA7XG59XG5cbmZ1bmN0aW9uIGlzUGxheWVyQWxpdmUoZ2FtZVN0YXRlLCBwbGF5ZXJJZCkge1xuICAgIHJldHVybiAhIWdldEFsaXZlUGxheWVycyhnYW1lU3RhdGUpLmZpbmQocCA9PiBwLmlkID09PSBwbGF5ZXJJZCk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUVmZmVjdChnYW1lU3RhdGUsIGVmZmVjdElkKSB7XG4gICAgZ2FtZVN0YXRlLmVmZmVjdEV2ZW50cy5wdXNoKHtcbiAgICAgICAgdHlwZTogXCJkZXNwYXduXCIsXG4gICAgICAgIHRpbWU6IGdhbWVTdGF0ZS5nYW1lVGltZSxcbiAgICAgICAgaWQ6IGVmZmVjdElkXG4gICAgfSk7XG4gICAgZ2FtZVN0YXRlLmVmZmVjdHMuc3BsaWNlKGdhbWVTdGF0ZS5lZmZlY3RzLmZpbmRJbmRleChlZmZlY3QgPT4gZWZmZWN0LmlkID09PSBlZmZlY3RJZCksIDEpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVQb3dlclVwKGdhbWVTdGF0ZSwgcG93ZXJVcElkKSB7XG4gICAgZ2FtZVN0YXRlLnBvd2VyVXBFdmVudHMucHVzaCh7XG4gICAgICAgIHR5cGU6IFwiZGVzcGF3blwiLFxuICAgICAgICB0aW1lOiBnYW1lU3RhdGUuZ2FtZVRpbWUsXG4gICAgICAgIGlkOiBwb3dlclVwSWRcbiAgICB9KTtcbiAgICBnYW1lU3RhdGUucG93ZXJVcHMuc3BsaWNlKGdhbWVTdGF0ZS5wb3dlclVwcy5maW5kSW5kZXgocG93ZXJVcCA9PiBwb3dlclVwLmlkID09PSBwb3dlclVwSWQpLCAxKTtcbn1cblxuZnVuY3Rpb24gcmVzZXRQbGF5QXJlYShnYW1lU3RhdGUpIHtcbiAgICB2YXIgZ3JpZCA9IGdhbWVTdGF0ZS5wbGF5QXJlYS5ncmlkO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZ3JpZC5sZW5ndGg7IGkrKykge1xuICAgICAgICBncmlkW2ldID0gY29uc3RhbnRzLlBMQVlfQVJFQV9GUkVFO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gc2V0UGxheWVyU3RlZXJpbmcoZ2FtZVN0YXRlLCBwbGF5ZXJJZCwgc3RlZXJpbmcpIHtcbiAgICB2YXIgcGxheWVyID0gZ2V0UGxheWVyKGdhbWVTdGF0ZSwgcGxheWVySWQpO1xuICAgIGlmIChwbGF5ZXIuc3RlZXJpbmcgIT09IHN0ZWVyaW5nKSB7XG4gICAgICAgIHBsYXllci5nYW1lVGltZVdoZW5TdGVlcmluZ0NoYW5nZWQgPSBnYW1lU3RhdGUuZ2FtZVRpbWU7XG4gICAgICAgIHBsYXllci5zdGVlcmluZyA9IHN0ZWVyaW5nO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZXh0cmFjdFJlcGxheUdhbWVTdGF0ZShnYW1lU3RhdGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB3b3JtczogZ2FtZVN0YXRlLndvcm1zLm1hcCh3b3JtID0+ICh7aWQ6IHdvcm0uaWR9KSksXG4gICAgICAgIHBsYXllcnM6IGdhbWVTdGF0ZS5wbGF5ZXJzLm1hcChwbGF5ZXIgPT4gKHtpZDogcGxheWVyLmlkfSkpLFxuICAgICAgICB3b3JtUGF0aFNlZ21lbnRzOiBnYW1lU3RhdGUud29ybVBhdGhTZWdtZW50cyxcbiAgICAgICAgZ2FtZUV2ZW50czogZ2FtZVN0YXRlLmdhbWVFdmVudHMsXG4gICAgICAgIHBvd2VyVXBFdmVudHM6IGdhbWVTdGF0ZS5wb3dlclVwRXZlbnRzLFxuICAgICAgICBlZmZlY3RFdmVudHM6IGdhbWVTdGF0ZS5lZmZlY3RFdmVudHMsXG4gICAgICAgIGdhbWVUaW1lOiBnYW1lU3RhdGUuZ2FtZVRpbWUsXG4gICAgICAgIG1hcDogZ2FtZVN0YXRlLm1hcFxuICAgIH07XG59XG5cbmZ1bmN0aW9uIGdldE5leHRJZChnYW1lU3RhdGUsIHByZWZpeCA9IFwiXCIpIHtcbiAgICB2YXIgbmV4dElkID0gcHJlZml4ICsgXCJfXCIgKyBnYW1lU3RhdGUubmV4dElkO1xuICAgIGdhbWVTdGF0ZS5uZXh0SWQgKz0gMTtcbiAgICByZXR1cm4gbmV4dElkO1xufVxuXG5mdW5jdGlvbiBhZGRQbGF5QXJlYVNoYXBlKGdhbWVTdGF0ZSwgc2hhcGUsIHZhbHVlKSB7XG4gICAgdmFyIHBsYXlBcmVhID0gZ2FtZVN0YXRlLnBsYXlBcmVhO1xuICAgIHZhciBwb2ludHMgPSBzaGFwZVRvR3JpZENvbnZlcnRlci5jb252ZXJ0KHNoYXBlLCBwbGF5QXJlYSk7XG4gICAgdmFyIGNoYW5nZWREYXRhID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gQnVmZmVyIHNob3VsZCBvbmx5IGJlIHVwZGF0ZWQgd2hlbiBhIHZhbHVlIGhhcyBjaGFuZ2VkXG4gICAgICAgIC8vIFRPRE8gQVRNIHdlIGRvIG5vdCBhY2NlcHQgXCJwYWludGluZyBvdmVyXCIuIElmIHdlIHdlcmUsIHdvcm0gd29ybSBjb2xsaXNpb24gd291bGQgaGF2ZSBpc3N1ZXMgc2luY2Ugd2Ugd291bGQgbm90IGNvbGxpZGUgYWdhaW5zdCBvdGhlciB3b3JtcywgbWlnaHQgd2FudCB0byBmaXggdGhpc1xuICAgICAgICBpZiAocGxheUFyZWEuZ3JpZFtwb2ludHNbaV1dICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgcGxheUFyZWEuZ3JpZFtwb2ludHNbaV1dID0gdmFsdWU7XG4gICAgICAgICAgICBjaGFuZ2VkRGF0YS5wdXNoKHtcbiAgICAgICAgICAgICAgICBpbmRleDogcG9pbnRzW2ldLFxuICAgICAgICAgICAgICAgIHZhbHVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY2hhbmdlZERhdGE7XG59XG5cbmZ1bmN0aW9uIGFkZFBsYXlBcmVhT2JzdGFjbGUoZ2FtZVN0YXRlLCBzaGFwZSkge1xuICAgIHJldHVybiBhZGRQbGF5QXJlYVNoYXBlKGdhbWVTdGF0ZSwgc2hhcGUsIGNvbnN0YW50cy5QTEFZX0FSRUFfT0JTVEFDTEUpO1xufVxuXG5mdW5jdGlvbiBpc0luU3RhcnRQaGFzZShnYW1lU3RhdGUpIHtcbiAgICByZXR1cm4gZ2FtZVN0YXRlLmdhbWVBY3RpdmUgJiYgZ2FtZVN0YXRlLnN0YXJ0UGhhc2VUaW1lciA+IDA7XG59XG5cbmZ1bmN0aW9uIGlzSW5QbGF5UGhhc2UoZ2FtZVN0YXRlKSB7XG4gICAgcmV0dXJuIGdhbWVTdGF0ZS5nYW1lQWN0aXZlICYmICFpc0luU3RhcnRQaGFzZShnYW1lU3RhdGUpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVHYW1lU3RhdGUoe1xuICAgIG1hcCxcbiAgICBzZWVkLFxuICAgIHBsYXllcnMgPSBbXSxcbiAgICB3b3JtcyA9IFtdLFxuICAgIHBvd2VyVXBzID0gW10sXG4gICAgZWZmZWN0cyA9IFtdLFxuICAgIHBsYXllclN0ZWVyaW5nU2VnbWVudHMgPSB7fSxcbiAgICB3b3JtUGF0aFNlZ21lbnRzID0ge30sXG4gICAgZ2FtZUV2ZW50cyA9IFtdLFxuICAgIHBvd2VyVXBFdmVudHMgPSBbXSxcbiAgICBlZmZlY3RFdmVudHMgPSBbXSxcbiAgICBnYW1lVGltZSA9IDAsXG4gICAgZ2FtZUFjdGl2ZSA9IGZhbHNlLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUT0RPOiBtaWdodCBnZXQgcmVtb3ZlZFxuICAgIHN0YXJ0UGhhc2VUaW1lciA9IGNvbnN0YW50cy5TVEFSVF9QSEFTRV9EVVJBVElPTixcbiAgICBuZXh0SWQgPSAwXG4gICAgfSA9IHt9KSB7XG4gICAgZnVuY3Rpb24gY3JlYXRlUGxheUFyZWEod2lkdGgsIGhlaWdodCkge1xuICAgICAgICB2YXIgcGxheUFyZWEgPSB7XG4gICAgICAgICAgICByb3dzOiBoZWlnaHQsXG4gICAgICAgICAgICBjb2xzOiB3aWR0aCxcbiAgICAgICAgICAgIGdyaWQ6IG5ldyBBcnJheShoZWlnaHQgKiB3aWR0aClcbiAgICAgICAgfTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwbGF5QXJlYS5ncmlkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBwbGF5QXJlYS5ncmlkW2ldID0gY29uc3RhbnRzLlBMQVlfQVJFQV9GUkVFO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwbGF5QXJlYTtcbiAgICB9XG5cbiAgICByZXR1cm4gY3JlYXRlU2ltcGxlR2FtZVN0YXRlKHtcbiAgICAgICAgcGxheWVycyxcbiAgICAgICAgLy8gIFt7XG4gICAgICAgIC8vICAgICAgaWQsXG4gICAgICAgIC8vICAgICAgc3RlZXJpbmcsXG4gICAgICAgIC8vICAgICAgZ2FtZVRpbWVXaGVuU3RlZXJpbmdDaGFuZ2VkLFxuICAgICAgICAvLyAgICAgIGFsaXZlXG4gICAgICAgIC8vICB9XVxuICAgICAgICB3b3JtcyxcbiAgICAgICAgLy8gIFt7XG4gICAgICAgIC8vICAgICAgaWQsXG4gICAgICAgIC8vICAgICAgcGxheWVySWQsXG4gICAgICAgIC8vICAgICAgY2VudGVyWCxcbiAgICAgICAgLy8gICAgICBjZW50ZXJZLFxuICAgICAgICAvLyAgICAgIHJhZGl1cyxcbiAgICAgICAgLy8gICAgICBkaXJlY3Rpb24sXG4gICAgICAgIC8vICAgICAgc3BlZWQsXG4gICAgICAgIC8vICAgICAgdHVybmluZ1NwZWVkLFxuICAgICAgICAvLyAgICAgIGFsaXZlLFxuICAgICAgICAvLyAgICAgIGp1bXA6IHtcbiAgICAgICAgLy8gICAgICAgICAgcmVtYWluaW5nSnVtcFRpbWU6IDAsXG4gICAgICAgIC8vICAgICAgICAgIHRpbWVTaW5jZUxhc3RKdW1wOiAwXG4gICAgICAgIC8vICAgICAgfSxcbiAgICAgICAgLy8gICAgICBpbW11bml0eURhdGE6IHVuZGVmaW5lZFxuICAgICAgICAvLyAgICAgIH1dXG5cbiAgICAgICAgcG93ZXJVcHMsXG4gICAgICAgIC8vICBbe1xuICAgICAgICAvLyAgICAgIGlkLFxuICAgICAgICAvLyAgICAgIG5hbWUsXG4gICAgICAgIC8vICAgICAgc2hhcGUsXG4gICAgICAgIC8vICAgICAgZWZmZWN0VHlwZSxcbiAgICAgICAgLy8gICAgICBlZmZlY3RTdHJlbmd0aCwgLy8gSGlnaGVyIG1lYW5zIG1vcmUgcG90ZW50LCBuZWdhdGl2ZSBjb3VsZCBtZWFuIHJldmVyc2VkLiBGb3Igc3BlZWQgZWZmZWN0LCAtMSBtZWFucyBkZWNyZWFzZWQgc3BlZWQgZm9yIGV4YW1wbGVcbiAgICAgICAgLy8gICAgICBlZmZlY3REdXJhdGlvbiwgLy8gVGhlIGR1cmF0aW9uIGZvciB0aGUgZWZmZWN0LCBpZiBpdCBoYXMgb25lXG4gICAgICAgIC8vICAgICAgYWZmZWN0cyAgICAgICAgIC8vIGFsbCB8IG90aGVycyB8IHNlbGZcbiAgICAgICAgLy8gIH1dXG5cbiAgICAgICAgZWZmZWN0cyxcbiAgICAgICAgLy8gIFt7XG4gICAgICAgIC8vICAgICAgdHlwZSxcbiAgICAgICAgLy8gICAgICByZW1haW5pbmdEdXJhdGlvbixcbiAgICAgICAgLy8gICAgICB3b3JtSWQsXG4gICAgICAgIC8vICAgICAgc3RyZW5ndGggICAgICAgICAgICAvLyBDb21lcyBmcm9tIHRoZSBwb3dlci11cHMgZWZmZWN0U3RyZW5ndGhcbiAgICAgICAgLy8gIH1dXG4gICAgICAgIHBsYXllclN0ZWVyaW5nU2VnbWVudHMsXG4gICAgICAgIC8vICB7W1xuICAgICAgICAvLyAgICAgIHN0ZWVyaW5nLFxuICAgICAgICAvLyAgICAgIHN0YXJ0VGltZSxcbiAgICAgICAgLy8gICAgICBkdXJhdGlvblxuICAgICAgICAvLyAgXX1cbiAgICAgICAgd29ybVBhdGhTZWdtZW50cyxcbiAgICAgICAgLy8gIHtbXG4gICAgICAgIC8vICAgICAgdHlwZSwgICAgICAgICAgIC8vIHN0cmFpZ2h0IHwgYXJjIHwgc3RpbGxfYXJjXG4gICAgICAgIC8vICAgICAgaW5kZXgsICAgICAgICAgIC8vIHRoZSBwb3NpdGlvbiBvZiB0aGUgc2VnbWVudCBpbiB0aGUgbGlzdFxuICAgICAgICAvLyAgICAgIGR1cmF0aW9uLFxuICAgICAgICAvLyAgICAgIHN0YXJ0VGltZSxcbiAgICAgICAgLy8gICAgICBlbmRUaW1lLFxuICAgICAgICAvLyAgICAgIGp1bXAsICAgICAgICAgICAvLyB0cnVlIHwgZmFsc2VcbiAgICAgICAgLy8gICAgICBzaXplLFxuICAgICAgICAvLyAgICAgIHBsYXllcklkLFxuICAgICAgICAvLyAgICAgIHN0YXJ0WCxcbiAgICAgICAgLy8gICAgICBzdGFydFksXG4gICAgICAgIC8vICAgICAgc3RhcnREaXJlY3Rpb24sXG4gICAgICAgIC8vICAgICAgc3BlZWQsXG4gICAgICAgIC8vICAgICAgdHVybmluZ1ZlbG9jaXR5XG4gICAgICAgIC8vICAgICAgZW5kWCxcbiAgICAgICAgLy8gICAgICBlbmRZLFxuICAgICAgICAvLyAgICAgIGVuZERpcmVjdGlvblxuICAgICAgICAvLyAgXX1cbiAgICAgICAgZ2FtZUV2ZW50cyxcbiAgICAgICAgLy8gIFt7XG4gICAgICAgIC8vICAgICAgdHlwZSwgICAgICAgICAgIC8vIGdhbWVfc3RhcnQgfCBwbGF5ZXJfZGllZCB8IGdhbWVfb3ZlclxuICAgICAgICAvLyAgICAgIHRpbWVcbiAgICAgICAgLy8gICAgICAoaWQpICAgICAgICAgICAgLy8gT25seSBmb3IgdHlwZSBwbGF5ZXJfZGllZFxuICAgICAgICAvLyAgfV0sXG4gICAgICAgIHBvd2VyVXBFdmVudHMsXG4gICAgICAgIC8vICBbe1xuICAgICAgICAvLyAgICAgIHR5cGUsICAgICAgICAgICAvLyBzcGF3biB8IGRlc3Bhd25cbiAgICAgICAgLy8gICAgICB0aW1lLFxuICAgICAgICAvLyAgICAgIChwb3dlclVwKSwgICAgICAvLyBPbmx5IGZvciB0eXBlIHNwYXduXG4gICAgICAgIC8vICAgICAgKGlkKSAgICAgICAgICAgIC8vIE9ubHkgZm9yIHR5cGUgZGVzcGF3blxuICAgICAgICAvLyAgfV0sXG4gICAgICAgIGVmZmVjdEV2ZW50cyxcbiAgICAgICAgLy8gIFt7XG4gICAgICAgIC8vICAgICAgdHlwZSxcbiAgICAgICAgLy8gICAgICB0aW1lXG4gICAgICAgIC8vICAgICAgKGVmZmVjdCkgICAgICAgIC8vIE9ubHkgZm9yIHR5cGUgc3Bhd25cbiAgICAgICAgLy8gICAgICAoaWQpICAgICAgICAgICAgLy8gT25seSBmb3IgdHlwZSBkZXNwYXduXG4gICAgICAgIC8vICB9XSxcbiAgICAgICAgbWFwLFxuICAgICAgICBwbGF5QXJlYTogbWFwID8gY3JlYXRlUGxheUFyZWEobWFwLndpZHRoLCBtYXAuaGVpZ2h0KSA6IG51bGwsXG4gICAgICAgIGdhbWVUaW1lLFxuICAgICAgICBnYW1lQWN0aXZlLCAvLyBUT0RPOiBtaWdodCBnZXQgcmVtb3ZlZFxuICAgICAgICBzdGFydFBoYXNlVGltZXIsIC8vIFRpbWUgbGVmdCB1bnRpbCBzdGFydCBwaGFzZSBlbmRzXG4gICAgICAgIHNlZWQsXG4gICAgICAgIG5leHRJZFxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNpbXBsZUdhbWVTdGF0ZShvcHRpb25zKSB7XG4gICAgdmFyIGdhbWVTdGF0ZSA9IHt9O1xuICAgIGZvckVhY2gob3B0aW9ucywgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgaWYgKHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGdhbWVTdGF0ZVtrZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZ2FtZVN0YXRlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBhZGRFZmZlY3QsXG4gICAgYWRkV29ybVBhdGhTZWdtZW50TWV0YURhdGEsXG4gICAgYWRkUGxheUFyZWFPYnN0YWNsZSxcbiAgICBhZGRQbGF5QXJlYVNoYXBlLFxuICAgIGFkZFBsYXllcixcbiAgICBhZGRQbGF5ZXJTdGVlcmluZ1NlZ21lbnQsXG4gICAgYWRkUG93ZXJVcCxcbiAgICBhZGRXb3JtLFxuICAgIGFkZFdvcm1QYXRoU2VnbWVudCxcbiAgICBjcmVhdGVHYW1lU3RhdGUsXG4gICAgY3JlYXRlU2ltcGxlR2FtZVN0YXRlLFxuICAgIGNyZWF0ZU1hcCxcbiAgICBjcmVhdGVNYXBDaXJjbGUsXG4gICAgY3JlYXRlTWFwUmVjdGFuZ2xlLFxuICAgIGNyZWF0ZU1hcFNxdWFyZSxcbiAgICBleHRyYWN0UmVwbGF5R2FtZVN0YXRlLFxuICAgIGZvckVhY2hBbGl2ZVBsYXllcixcbiAgICBmb3JFYWNoQWxpdmVXb3JtLFxuICAgIGZvckVhY2hBbGl2ZUxhdGVzdFdvcm1QYXRoU2VnbWVudCxcbiAgICBnZXRBbGl2ZUVuZW15V29ybXMsXG4gICAgZ2V0QWxpdmVQbGF5ZXJzLFxuICAgIGdldEFsaXZlV29ybXMsXG4gICAgZ2V0RWZmZWN0LFxuICAgIGdldExhdGVzdFdvcm1QYXRoU2VnbWVudCxcbiAgICBnZXROZXh0SWQsXG4gICAgZ2V0UG93ZXJVcCxcbiAgICBnZXRQbGF5ZXIsXG4gICAgZ2V0V29ybSxcbiAgICBnZXRXb3JtRWZmZWN0LFxuICAgIGdldFdvcm1FZmZlY3RzLFxuICAgIGhhc1dvcm1FZmZlY3QsXG4gICAgaXNJblN0YXJ0UGhhc2UsXG4gICAgaXNJblBsYXlQaGFzZSxcbiAgICBpc1BsYXllckFsaXZlLFxuICAgIHJlbW92ZUVmZmVjdCxcbiAgICByZW1vdmVQb3dlclVwLFxuICAgIHJlc2V0UGxheUFyZWEsXG4gICAgc2V0UGxheWVyU3RlZXJpbmdcbn07IiwiLyoqXG4gKiBSZXByZXNlbnRzIHRoZSBwYXJhbWV0ZXJzIGZvciBhIGdlbmVyaWMgc2hhcGUuXG4gKiBAcGFyYW0gdHlwZVxuICogQHBhcmFtIGJvdW5kaW5nV2lkdGhcbiAqIEBwYXJhbSBib3VuZGluZ0hlaWdodFxuICogQHBhcmFtIHggSWYgdW5kZWZpbmVkIHRoZW4gbm8gY29vcmRpbmF0ZSB2YXJpYWJsZXMgd2lsbCBiZSBjcmVhdGVkXG4gKiBAcGFyYW0geSBJZiB1bmRlZmluZWQgdGhlbiBubyBjb29kaW5hdGUgdmFyaWFibGVzIHdpbGwgYmUgY3JlYXRlZFxuICogQHJldHVybnMge3t9fVxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVNoYXBlKHR5cGUsIGJvdW5kaW5nV2lkdGgsIGJvdW5kaW5nSGVpZ2h0LCB4LCB5LCBhcmVhKSB7XG4gICAgZnVuY3Rpb24gc2V0Q29vcmRpbmF0ZXModGFyZ2V0LCBib3VuZGluZ0JveCwgeCwgeSkge1xuICAgICAgICB0YXJnZXQueCA9IHg7XG4gICAgICAgIHRhcmdldC55ID0geTtcbiAgICAgICAgdGFyZ2V0Lm1heFggPSB4ICsgYm91bmRpbmdCb3gud2lkdGg7XG4gICAgICAgIHRhcmdldC5tYXhZID0geSArIGJvdW5kaW5nQm94LmhlaWdodDtcbiAgICAgICAgdGFyZ2V0LmNlbnRlclggPSB4ICsgYm91bmRpbmdCb3gud2lkdGggLyAyO1xuICAgICAgICB0YXJnZXQuY2VudGVyWSA9IHkgKyBib3VuZGluZ0JveC5oZWlnaHQgLyAyO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUJvdW5kaW5nQm94KHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHdpZHRoOiB3aWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNEZWZpbmVkKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsO1xuICAgIH1cblxuICAgIHZhciBzaGFwZSA9IHt9O1xuICAgIHNoYXBlLnR5cGUgPSB0eXBlO1xuICAgIHNoYXBlLmJvdW5kaW5nQm94ID0gY3JlYXRlQm91bmRpbmdCb3goYm91bmRpbmdXaWR0aCwgYm91bmRpbmdIZWlnaHQpO1xuICAgIHNoYXBlLmFyZWEgPSBhcmVhO1xuXG4gICAgaWYgKGlzRGVmaW5lZCh4KSAmJiBpc0RlZmluZWQoeSkpIHtcbiAgICAgICAgLy8gb25seSBzZXQgdGhlIGNvb3JkaW5hdGUgcGFyYW1ldGVycyBpZiB4IGFuZCB5IGFyZSBwcm92aWRlZFxuICAgICAgICBzZXRDb29yZGluYXRlcyhzaGFwZSwgc2hhcGUuYm91bmRpbmdCb3gsIHgsIHkpO1xuICAgIH1cblxuICAgIHJldHVybiBzaGFwZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ2lyY2xlKHJhZGl1cywgeCwgeSkge1xuICAgIHZhciBhcmVhID0gTWF0aC5QSSAqIHJhZGl1cyAqIHJhZGl1cztcbiAgICB2YXIgc2hhcGUgPSBjcmVhdGVTaGFwZShcImNpcmNsZVwiLCByYWRpdXMgKiAyLCByYWRpdXMgKiAyLCB4LCB5LCBhcmVhKTtcbiAgICBzaGFwZS5yYWRpdXMgPSByYWRpdXM7XG4gICAgcmV0dXJuIHNoYXBlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVSZWN0YW5nbGUod2lkdGgsIGhlaWdodCwgeCwgeSkge1xuICAgIHZhciBhcmVhID0gd2lkdGggKiBoZWlnaHQ7XG4gICAgdmFyIHNoYXBlID0gY3JlYXRlU2hhcGUoXCJyZWN0YW5nbGVcIiwgd2lkdGgsIGhlaWdodCwgeCwgeSwgYXJlYSk7XG5cbiAgICBzaGFwZS53aWR0aCA9IHdpZHRoO1xuICAgIHNoYXBlLmhlaWdodCA9IGhlaWdodDtcbiAgICByZXR1cm4gc2hhcGU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNxdWFyZShzaXplLCB4LCB5KSB7XG4gICAgcmV0dXJuIGNyZWF0ZVJlY3RhbmdsZShzaXplLCBzaXplLCB4LCB5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgY3JlYXRlQ2lyY2xlLFxuICAgIGNyZWF0ZVJlY3RhbmdsZSxcbiAgICBjcmVhdGVTcXVhcmVcbn07XG4iLCJ2YXIgc3BhdGlhbFJlbGF0aW9ucyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnNwYXRpYWxSZWxhdGlvbnMuaW50ZXJzZWN0cyA9IGZ1bmN0aW9uIGludGVyc2VjdHMoc2hhcGUsIG90aGVyU2hhcGUpIHtcbiAgICByZXR1cm4gaXNSZWxhdGlvblRydWUoaW50ZXJzZWN0c0Z1bmN0aW9ucywgc2hhcGUsIG90aGVyU2hhcGUpO1xufTtcblxuc3BhdGlhbFJlbGF0aW9ucy5jb250YWlucyA9IGZ1bmN0aW9uIGNvbnRhaW5zKG91dGVyU2hhcGUsIGlubmVyU2hhcGUpIHtcbiAgICByZXR1cm4gaXNSZWxhdGlvblRydWUoY29udGFpbm1lbnRGdW5jdGlvbnMsIG91dGVyU2hhcGUsIGlubmVyU2hhcGUpO1xufTtcblxuc3BhdGlhbFJlbGF0aW9ucy5kaXN0YW5jZVNxdWFyZWQgPSBmdW5jdGlvbiBkaXN0YW5jZShzaGFwZSwgb3RoZXJTaGFwZSkge1xuICAgIHZhciBkaXN0ID0gZ2V0WFlEaXN0KHNoYXBlLCBvdGhlclNoYXBlKTtcbiAgICByZXR1cm4gZGlzdC54ICogZGlzdC54ICsgZGlzdC55ICogZGlzdC55O1xufTtcblxuLy8gLS0gSU5URVJTRUNUSU9OLUZVTkNUSU9OUyAtLVxudmFyIGludGVyc2VjdHNGdW5jdGlvbnMgPSBjcmVhdGVTaGFwZVJlbGF0aW9uTWF0cml4KCk7XG5cbmludGVyc2VjdHNGdW5jdGlvbnNbXCJjaXJjbGVcIl1bXCJjaXJjbGVcIl0gPSBmdW5jdGlvbiBjaXJjbGVDaXJjbGVJbnRlcnNlY3Rpb24oY2lyY2xlLCBvdGhlckNpcmNsZSkge1xuICAgIGlmICghYm91bmRpbmdCb3hlc0ludGVyc2VjdHMoY2lyY2xlLCBvdGhlckNpcmNsZSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBtYXhBbGxvd2VkRGlzdCA9IGNpcmNsZS5yYWRpdXMgKyBvdGhlckNpcmNsZS5yYWRpdXM7XG5cbiAgICByZXR1cm4gc3BhdGlhbFJlbGF0aW9ucy5kaXN0YW5jZVNxdWFyZWQoY2lyY2xlLCBvdGhlckNpcmNsZSkgPCBtYXhBbGxvd2VkRGlzdCAqIG1heEFsbG93ZWREaXN0O1xufTtcblxuaW50ZXJzZWN0c0Z1bmN0aW9uc1tcInJlY3RhbmdsZVwiXVtcInJlY3RhbmdsZVwiXSA9IGZ1bmN0aW9uIHJlY3RhbmdsZVJlY3RhbmdsZUludGVyc2VjdGlvbihyZWN0YW5nbGUsIG90aGVyUmVjdGFuZ2xlKSB7XG4gICAgcmV0dXJuIGJvdW5kaW5nQm94ZXNJbnRlcnNlY3RzKHJlY3RhbmdsZSwgb3RoZXJSZWN0YW5nbGUpO1xufTtcblxuaW50ZXJzZWN0c0Z1bmN0aW9uc1tcImNpcmNsZVwiXVtcInJlY3RhbmdsZVwiXSA9IGZ1bmN0aW9uIGNpcmNsZVJlY3RhbmdsZUludGVyc2VjdGlvbihjaXJjbGUsIHJlY3RhbmdsZSkge1xuICAgIGlmICghYm91bmRpbmdCb3hlc0ludGVyc2VjdHMoY2lyY2xlLCByZWN0YW5nbGUpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgZGlzdCA9IGdldFhZRGlzdChjaXJjbGUsIHJlY3RhbmdsZSk7XG5cbiAgICAvL1RoZSBmb2xsb3dpbmcgMiBjaGVja3MgYXJlIG9ubHkgdmFsaWQgYmVjYXVzZSBvZiBwcmlvciBjaGVja2luZyBvZiB0aGUgYm91bmRpbmcgYm94ZXNcbiAgICBpZiAoZGlzdC54IDw9IChyZWN0YW5nbGUud2lkdGggLyAyKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGRpc3QueSA8PSAocmVjdGFuZ2xlLmhlaWdodCAvIDIpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIHNwZWNpYWwgY2FzZSBmb3IgcmVjdGFuZ2xlIGNvcm5lcnNcbiAgICB2YXIgY29ybmVyRGlzdFggPSBkaXN0LnggLSByZWN0YW5nbGUud2lkdGggLyAyO1xuICAgIHZhciBjb3JuZXJEaXN0WSA9IGRpc3QueSAtIHJlY3RhbmdsZS5oZWlnaHQgLyAyO1xuICAgIHZhciBjb3JuZXJEaXN0YW5jZVNxID0gY29ybmVyRGlzdFgqY29ybmVyRGlzdFggKyBjb3JuZXJEaXN0WSpjb3JuZXJEaXN0WTtcblxuICAgIHJldHVybiBjb3JuZXJEaXN0YW5jZVNxIDw9IGNpcmNsZS5yYWRpdXMgKiBjaXJjbGUucmFkaXVzO1xufTtcblxuaW50ZXJzZWN0c0Z1bmN0aW9uc1tcInJlY3RhbmdsZVwiXVtcImNpcmNsZVwiXSA9IGZ1bmN0aW9uIHJlY3RhbmdsZUNpcmNsZUludGVyc2VjdGlvbihyZWN0YW5nbGUsIGNpcmNsZSkge1xuICAgIHJldHVybiBpbnRlcnNlY3RzRnVuY3Rpb25zW1wiY2lyY2xlXCJdW1wicmVjdGFuZ2xlXCJdKGNpcmNsZSwgcmVjdGFuZ2xlKTtcbn07XG5cblxuLy8gLS0gQ09OVEFJTk1FTlQtRlVOQ1RJT05TXG52YXIgY29udGFpbm1lbnRGdW5jdGlvbnMgPSBjcmVhdGVTaGFwZVJlbGF0aW9uTWF0cml4KCk7XG5cbmNvbnRhaW5tZW50RnVuY3Rpb25zW1wiY2lyY2xlXCJdW1wiY2lyY2xlXCJdID0gZnVuY3Rpb24gY2lyY2xlQ2lyY2xlQ29udGFpbm1lbnQob3V0ZXJDaXJjbGUsIGlubmVyQ2lyY2xlKSB7XG4gICAgaWYgKCFib3VuZGluZ0JveGVzQ29udGFpbnMob3V0ZXJDaXJjbGUsIGlubmVyQ2lyY2xlKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIG1heEFsbG93ZWREaXN0ID0gb3V0ZXJDaXJjbGUucmFkaXVzIC0gaW5uZXJDaXJjbGUucmFkaXVzO1xuXG4gICAgcmV0dXJuIHNwYXRpYWxSZWxhdGlvbnMuZGlzdGFuY2VTcXVhcmVkKG91dGVyQ2lyY2xlLCBpbm5lckNpcmNsZSkgPCBtYXhBbGxvd2VkRGlzdCAqIG1heEFsbG93ZWREaXN0O1xufTtcblxuY29udGFpbm1lbnRGdW5jdGlvbnNbXCJyZWN0YW5nbGVcIl1bXCJyZWN0YW5nbGVcIl0gPSBmdW5jdGlvbiByZWN0YW5nbGVSZWN0YW5nbGVDb250YWlubWVudChvdXRlclJlY3RhbmdsZSwgaW5uZXJSZWN0YW5nbGUpIHtcbiAgICByZXR1cm4gYm91bmRpbmdCb3hlc0NvbnRhaW5zKG91dGVyUmVjdGFuZ2xlLCBpbm5lclJlY3RhbmdsZSk7XG59O1xuXG5jb250YWlubWVudEZ1bmN0aW9uc1tcImNpcmNsZVwiXVtcInJlY3RhbmdsZVwiXSA9IGZ1bmN0aW9uIGNpcmNsZVJlY3RhbmdsZUNvbnRhaW5tZW50KG91dGVyQ2lyY2xlLCBpbm5lclJlY3RhbmdsZSkge1xuICAgIGlmICghYm91bmRpbmdCb3hlc0NvbnRhaW5zKG91dGVyQ2lyY2xlLCBpbm5lclJlY3RhbmdsZSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vaGVyZSB3ZSBzZWxlY3QgdGhlIHJlY3RhbmdsZXMgY29ybmVyIHBvaW50IGZ1cnRoZXN0IGF3YXkgZnJvbSB0aGUgY2lyY2xlIGNlbnRlclxuICAgIHZhciBkaXN0WCA9IE1hdGgubWF4KE1hdGguYWJzKG91dGVyQ2lyY2xlLmNlbnRlclggLSBpbm5lclJlY3RhbmdsZS54KSwgTWF0aC5hYnMob3V0ZXJDaXJjbGUuY2VudGVyWCAtIGlubmVyUmVjdGFuZ2xlLm1heFgpKTtcbiAgICB2YXIgZGlzdFkgPSBNYXRoLm1heChNYXRoLmFicyhvdXRlckNpcmNsZS5jZW50ZXJZIC0gaW5uZXJSZWN0YW5nbGUueSksIE1hdGguYWJzKG91dGVyQ2lyY2xlLmNlbnRlclkgLSBpbm5lclJlY3RhbmdsZS5tYXhZKSk7XG5cbiAgICByZXR1cm4gZGlzdFgqZGlzdFggKyBkaXN0WSpkaXN0WSA8PSBvdXRlckNpcmNsZS5yYWRpdXMqb3V0ZXJDaXJjbGUucmFkaXVzO1xufTtcblxuY29udGFpbm1lbnRGdW5jdGlvbnNbXCJyZWN0YW5nbGVcIl1bXCJjaXJjbGVcIl0gPSBmdW5jdGlvbiByZWN0YW5nbGVDaXJjbGVDb250YWlubWVudChvdXRlclJlY3RhbmdsZSwgaW5uZXJDaXJjbGUpIHtcbiAgICByZXR1cm4gYm91bmRpbmdCb3hlc0NvbnRhaW5zKG91dGVyUmVjdGFuZ2xlLCBpbm5lckNpcmNsZSk7XG59O1xuXG5cbi8vIC0tIFVUSUxJVFktRlVOQ1RJT05TIC0tXG5mdW5jdGlvbiBpc1JlbGF0aW9uVHJ1ZShzcGF0aWFsUmVsYXRpb25zRnVuY3Rpb25zLCBzaGFwZSwgb3RoZXJTaGFwZSkge1xuICAgIGZ1bmN0aW9uIGNvbnZlcnRXb3JtVG9DaXJjbGUodykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogXCJjaXJjbGVcIixcbiAgICAgICAgICAgIGNlbnRlclg6IHcuY2VudGVyWCxcbiAgICAgICAgICAgIGNlbnRlclk6IHcuY2VudGVyWSxcbiAgICAgICAgICAgIHg6IHcuY2VudGVyWCAtIHcucmFkaXVzLFxuICAgICAgICAgICAgeTogdy5jZW50ZXJZIC0gdy5yYWRpdXMsXG4gICAgICAgICAgICBtYXhYOiB3LmNlbnRlclggKyB3LnJhZGl1cyxcbiAgICAgICAgICAgIG1heFk6IHcuY2VudGVyWSArIHcucmFkaXVzLFxuICAgICAgICAgICAgcmFkaXVzOiB3LnJhZGl1cyxcbiAgICAgICAgICAgIGJvdW5kaW5nQm94OiB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHcucmFkaXVzICogMixcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHcucmFkaXVzICogMlxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIFRPRE8gTm90IHRoZSBwcmV0dGllc3QgYnV0IHdvcmtzIGZvciBub3cuIFRoaXMgaGFuZGxlcyBzcGVjaWFsIHdvcm0gdHJlYXRtZW50XG4gICAgaWYgKCFzaGFwZS50eXBlKSB7XG4gICAgICAgIHNoYXBlID0gY29udmVydFdvcm1Ub0NpcmNsZShzaGFwZSk7XG4gICAgfVxuXG4gICAgaWYoIW90aGVyU2hhcGUudHlwZSkge1xuICAgICAgICBvdGhlclNoYXBlID0gY29udmVydFdvcm1Ub0NpcmNsZShvdGhlclNoYXBlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3BhdGlhbFJlbGF0aW9uc0Z1bmN0aW9uc1tzaGFwZS50eXBlXVtvdGhlclNoYXBlLnR5cGVdKHNoYXBlLCBvdGhlclNoYXBlKTtcbn1cblxuZnVuY3Rpb24gYm91bmRpbmdCb3hlc0ludGVyc2VjdHMoc2hhcGUsIG90aGVyU2hhcGUpIHtcbiAgICB2YXIgZGlzdCA9IGdldFhZRGlzdChzaGFwZSwgb3RoZXJTaGFwZSk7XG5cbiAgICB2YXIgbWluQm91bmRpbmdEaXN0WCA9IHNoYXBlLmJvdW5kaW5nQm94LndpZHRoIC8gMiArIG90aGVyU2hhcGUuYm91bmRpbmdCb3gud2lkdGggLyAyO1xuICAgIHZhciBtaW5Cb3VuZGluZ0Rpc3RZID0gc2hhcGUuYm91bmRpbmdCb3guaGVpZ2h0IC8gMiArIG90aGVyU2hhcGUuYm91bmRpbmdCb3guaGVpZ2h0IC8gMjtcblxuICAgIHJldHVybiAhKGRpc3QueCA+IG1pbkJvdW5kaW5nRGlzdFggfHwgZGlzdC55ID4gbWluQm91bmRpbmdEaXN0WSk7XG59XG5cbmZ1bmN0aW9uIGJvdW5kaW5nQm94ZXNDb250YWlucyhvdXRlclNoYXBlLCBpbm5lclNoYXBlKSB7XG4gICAgdmFyIGRpc3QgPSBnZXRYWURpc3Qob3V0ZXJTaGFwZSwgaW5uZXJTaGFwZSk7XG5cbiAgICBkaXN0LnggKz0gaW5uZXJTaGFwZS5ib3VuZGluZ0JveC53aWR0aCAvIDI7XG4gICAgZGlzdC55ICs9IGlubmVyU2hhcGUuYm91bmRpbmdCb3guaGVpZ2h0IC8gMjtcblxuICAgIHJldHVybiBkaXN0LnggPCBvdXRlclNoYXBlLmJvdW5kaW5nQm94LndpZHRoIC8gMiAmJiBkaXN0LnkgPCBvdXRlclNoYXBlLmJvdW5kaW5nQm94LmhlaWdodCAvIDI7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNoYXBlUmVsYXRpb25NYXRyaXgoKSB7XG4gICAgdmFyIG1hdHJpeCA9IFtdO1xuICAgIG1hdHJpeFtcImNpcmNsZVwiXSA9IFtdO1xuICAgIG1hdHJpeFtcInJlY3RhbmdsZVwiXSA9IFtdO1xuICAgIHJldHVybiBtYXRyaXg7XG59XG5cbmZ1bmN0aW9uIGdldFhZRGlzdChzaGFwZSwgb3RoZXJTaGFwZSkge1xuICAgIHZhciBkaXN0ID0ge307XG4gICAgZGlzdC54ID0gTWF0aC5hYnMoc2hhcGUuY2VudGVyWCAtIG90aGVyU2hhcGUuY2VudGVyWCk7XG4gICAgZGlzdC55ID0gTWF0aC5hYnMoc2hhcGUuY2VudGVyWSAtIG90aGVyU2hhcGUuY2VudGVyWSk7XG4gICAgcmV0dXJuIGRpc3Q7XG59XG4iLCJ2YXIgZ3JpZFV0aWxzID0gcmVxdWlyZShcIi4vLi4vdXRpbC9ncmlkLmpzXCIpO1xuXG52YXIgY29udmVydEZ1bmN0aW9ucyA9IHt9O1xuY29udmVydEZ1bmN0aW9uc1tcInJlY3RhbmdsZVwiXSA9IGZ1bmN0aW9uIHJlY3RUb0dyaWQocmVjdCwgZ3JpZCwgcm91bmRpbmdNb2RlKSB7XG4gICAgdmFyIGxlZnRSb3cgPSBNYXRoLm1heCgwLCByb3VuZGluZ01vZGUucm91bmRMZWZ0KHJlY3QueSkpO1xuICAgIHZhciBsZWZ0Q29sID0gTWF0aC5tYXgoMCwgcm91bmRpbmdNb2RlLnJvdW5kTGVmdChyZWN0LngpKTtcblxuICAgIHZhciByaWdodFJvdyA9IE1hdGgubWluKGdyaWQucm93cyAtIDEsIHJvdW5kaW5nTW9kZS5yb3VuZFJpZ2h0KHJlY3QubWF4WSkpO1xuICAgIHZhciByaWdodENvbCA9IE1hdGgubWluKGdyaWQuY29scyAtIDEsIHJvdW5kaW5nTW9kZS5yb3VuZFJpZ2h0KHJlY3QubWF4WCkpO1xuXG4gICAgdmFyIHNpemUgPSAocmlnaHRSb3cgLSBsZWZ0Um93ICsgMSkgKiAocmlnaHRDb2wgLSBsZWZ0Q29sICsgMSk7XG4gICAgdmFyIHBvaW50cyA9IG5ldyBBcnJheShzaXplKTtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIGZvciAodmFyIHJvdyA9IGxlZnRSb3c7IHJvdyA8PSByaWdodFJvdzsgcm93KyspIHtcbiAgICAgICAgZm9yICh2YXIgY29sID0gbGVmdENvbDsgY29sIDw9IHJpZ2h0Q29sOyBjb2wrKykge1xuICAgICAgICAgICAgaWYgKGdyaWRVdGlscy5pc0luc2lkZUdyaWQoZ3JpZCwgcm93LCBjb2wpKSB7XG4gICAgICAgICAgICAgICAgcG9pbnRzW2luZGV4KytdID0gKGdyaWRVdGlscy5nZXRJbmRleChncmlkLCByb3csIGNvbCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHBvaW50cztcbn07XG5jb252ZXJ0RnVuY3Rpb25zW1wiY2lyY2xlXCJdID0gZnVuY3Rpb24gY2lyY2xlVG9HcmlkKGNpcmNsZSwgZ3JpZCwgcm91bmRpbmdNb2RlKSB7XG4gICAgdmFyIGZpcnN0Um93ID0gTWF0aC5tYXgoMCwgcm91bmRpbmdNb2RlLnJvdW5kTGVmdChjaXJjbGUueSkpO1xuICAgIHZhciBtaWRSb3cgPSBNYXRoLnJvdW5kKGNpcmNsZS5jZW50ZXJZKTtcbiAgICB2YXIgbGFzdFJvdyA9IE1hdGgubWluKGdyaWQucm93cyAtIDEsIHJvdW5kaW5nTW9kZS5yb3VuZFJpZ2h0KGNpcmNsZS5tYXhZKSk7XG5cbiAgICB2YXIgcG9pbnRzID0gW107XG4gICAgZm9yICh2YXIgcm93ID0gZmlyc3RSb3c7IHJvdyA8PSBsYXN0Um93OyByb3crKykge1xuICAgICAgICB2YXIgZHkgPSBtaWRSb3cgLSByb3c7XG4gICAgICAgIHZhciBkeCA9IE1hdGguc3FydChjaXJjbGUucmFkaXVzICogY2lyY2xlLnJhZGl1cyAtIGR5ICogZHkpO1xuICAgICAgICB2YXIgZmlyc3RDb2wgPSBNYXRoLm1heCgwLCByb3VuZGluZ01vZGUucm91bmRMZWZ0KChjaXJjbGUuY2VudGVyWCAtIGR4KSkpO1xuICAgICAgICB2YXIgbGFzdENvbCA9IE1hdGgubWluKGdyaWQuY29scyAtIDEsIHJvdW5kaW5nTW9kZS5yb3VuZFJpZ2h0KChjaXJjbGUuY2VudGVyWCArIGR4KSkpO1xuICAgICAgICBmb3IgKHZhciBjb2wgPSBmaXJzdENvbDsgY29sIDw9IGxhc3RDb2w7IGNvbCsrKSB7XG4gICAgICAgICAgICBwb2ludHMucHVzaChncmlkVXRpbHMuZ2V0SW5kZXgoZ3JpZCwgcm93LCBjb2wpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBwb2ludHM7XG59O1xuXG5jb252ZXJ0RnVuY3Rpb25zW1wid29ybVwiXSA9IGZ1bmN0aW9uIHdvcm1Ub0dyaWQod29ybSwgZ3JpZCwgcm91bmRpbmdNb2RlKSB7XG4gICAgcmV0dXJuIGNvbnZlcnRGdW5jdGlvbnNbXCJjaXJjbGVcIl0oe1xuICAgICAgICBjZW50ZXJYOiB3b3JtLmNlbnRlclgsXG4gICAgICAgIGNlbnRlclk6IHdvcm0uY2VudGVyWSxcbiAgICAgICAgeDogd29ybS5jZW50ZXJYIC0gd29ybS5yYWRpdXMsXG4gICAgICAgIHk6IHdvcm0uY2VudGVyWSAtIHdvcm0ucmFkaXVzLFxuICAgICAgICBtYXhYOiB3b3JtLmNlbnRlclggKyB3b3JtLnJhZGl1cyxcbiAgICAgICAgbWF4WTogd29ybS5jZW50ZXJZICsgd29ybS5yYWRpdXMsXG4gICAgICAgIHJhZGl1czogd29ybS5yYWRpdXNcbiAgICB9LCBncmlkLCByb3VuZGluZ01vZGUpO1xufTtcblxuZnVuY3Rpb24gY3JlYXRlUm91bmRpbmdNb2RlKHJvdW5kTGVmdCwgcm91bmRSaWdodCkge1xuICAgIHJldHVybiB7cm91bmRMZWZ0OiByb3VuZExlZnQsIHJvdW5kUmlnaHQ6IHJvdW5kUmlnaHR9O1xufVxuXG52YXIgU2hhcGVUb0dyaWRDb252ZXJ0ZXIgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5TaGFwZVRvR3JpZENvbnZlcnRlci5Sb3VuZGluZ01vZGVzID0ge307XG5TaGFwZVRvR3JpZENvbnZlcnRlci5Sb3VuZGluZ01vZGVzLlJPVU5EID0gY3JlYXRlUm91bmRpbmdNb2RlKE1hdGgucm91bmQsIE1hdGgucm91bmQpO1xuU2hhcGVUb0dyaWRDb252ZXJ0ZXIuUm91bmRpbmdNb2Rlcy5DT05UQUlOTUVOVCA9IGNyZWF0ZVJvdW5kaW5nTW9kZShNYXRoLmNlaWwsIE1hdGguZmxvb3IpO1xuU2hhcGVUb0dyaWRDb252ZXJ0ZXIuUm91bmRpbmdNb2Rlcy5JTlRFUlNFQ1RJT04gPSBjcmVhdGVSb3VuZGluZ01vZGUoTWF0aC5mbG9vciwgTWF0aC5jZWlsKTtcblxuU2hhcGVUb0dyaWRDb252ZXJ0ZXIuY3JlYXRlU2hhcGVUb0dyaWRDb252ZXJ0ZXIgPSBmdW5jdGlvbiBjcmVhdGVTaGFwZVRvR3JpZENvbnZlcnRlcigpIHtcbiAgICBmdW5jdGlvbiBjb252ZXJ0KHNoYXBlLCBncmlkLCByb3VuZGluZ01vZGUpIHtcbiAgICAgICAgdmFyIHR5cGUgPSBzaGFwZS50eXBlIHx8IFwid29ybVwiO1xuICAgICAgICB2YXIgY29udmVydEZ1bmN0aW9uID0gY29udmVydEZ1bmN0aW9uc1t0eXBlXTtcblxuICAgICAgICByb3VuZGluZ01vZGUgPSByb3VuZGluZ01vZGUgfHwgU2hhcGVUb0dyaWRDb252ZXJ0ZXIuUm91bmRpbmdNb2Rlcy5ST1VORDtcblxuICAgICAgICBpZihzaGFwZSlcbiAgICAgICAgcmV0dXJuIGNvbnZlcnRGdW5jdGlvbihzaGFwZSwgZ3JpZCwgcm91bmRpbmdNb2RlKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb252ZXJ0OiBjb252ZXJ0XG4gICAgfTtcbn07IiwidmFyIHNoYXBlRmFjdG9yeSA9IHJlcXVpcmUoXCIuLi9zaGFwZS1mYWN0b3J5LmpzXCIpO1xudmFyIHNoYXBlU3BhdGlhbFJlbGF0aW9ucyA9IHJlcXVpcmUoXCIuLi9zaGFwZS1zcGF0aWFsLXJlbGF0aW9ucy5qc1wiKTtcblxuZGVzY3JpYmUoXCJTaGFwZSBzcGF0aWFsIHJlbGF0aW9uc1wiLCBmdW5jdGlvbigpIHtcblxuICAgIGl0KFwic2hvdWxkIGRldGVjdCBjaXJjbGUgaW4gcmVjdGFuZ2xlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY2lyY2xlID0gc2hhcGVGYWN0b3J5LmNyZWF0ZUNpcmNsZSgyLjgsIDAuMSwgMC4xKTtcbiAgICAgICAgdmFyIHJlY3RhbmdsZSA9IHNoYXBlRmFjdG9yeS5jcmVhdGVSZWN0YW5nbGUoNiwgNiwgMCwgMCk7XG4gICAgICAgIGV4cGVjdChzaGFwZVNwYXRpYWxSZWxhdGlvbnMuY29udGFpbnMocmVjdGFuZ2xlLCBjaXJjbGUpKS50b0JlVHJ1dGh5KCk7XG4gICAgfSk7XG5cbiAgICBpdChcInNob3VsZCBub3QgZGV0ZWN0IGNpcmNsZSBvdXRzaWRlIG9mIHJlY3RhbmdsZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNpcmNsZSA9IHNoYXBlRmFjdG9yeS5jcmVhdGVDaXJjbGUoMywgMC45LCAwLjkpO1xuICAgICAgICB2YXIgcmVjdGFuZ2xlID0gc2hhcGVGYWN0b3J5LmNyZWF0ZVJlY3RhbmdsZSg2LCA2LCAxLCAxKTtcbiAgICAgICAgZXhwZWN0KHNoYXBlU3BhdGlhbFJlbGF0aW9ucy5jb250YWlucyhyZWN0YW5nbGUsIGNpcmNsZSkpLnRvQmVGYWxzeSgpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJzaG91bGQgZGV0ZWN0IHJlY3RhbmdsZSBpbiBjaXJjbGVcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciByZWN0YW5nbGUxID0gc2hhcGVGYWN0b3J5LmNyZWF0ZVJlY3RhbmdsZSg2LCAyLCAxLCAzKTtcbiAgICAgICAgdmFyIHJlY3RhbmdsZTIgPSBzaGFwZUZhY3RvcnkuY3JlYXRlUmVjdGFuZ2xlKDQsIDQsIDIsIDEpO1xuICAgICAgICB2YXIgY2lyY2xlID0gc2hhcGVGYWN0b3J5LmNyZWF0ZUNpcmNsZSg0LCAwLCAwKTtcbiAgICAgICAgZXhwZWN0KHNoYXBlU3BhdGlhbFJlbGF0aW9ucy5jb250YWlucyhjaXJjbGUsIHJlY3RhbmdsZTEpKS50b0JlVHJ1dGh5KCk7XG4gICAgICAgIGV4cGVjdChzaGFwZVNwYXRpYWxSZWxhdGlvbnMuY29udGFpbnMoY2lyY2xlLCByZWN0YW5nbGUyKSkudG9CZVRydXRoeSgpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJzaG91bGQgbm90IGRldGVjdCByZWN0YW5nbGUgb3V0c2lkZSBvZiBjaXJjbGVcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciByZWN0YW5nbGUgPSBzaGFwZUZhY3RvcnkuY3JlYXRlUmVjdGFuZ2xlKDUsIDUsIDIsIDEpO1xuICAgICAgICB2YXIgY2lyY2xlID0gc2hhcGVGYWN0b3J5LmNyZWF0ZUNpcmNsZSg0LCAwLCAwKTtcbiAgICAgICAgZXhwZWN0KHNoYXBlU3BhdGlhbFJlbGF0aW9ucy5jb250YWlucyhjaXJjbGUsIHJlY3RhbmdsZSkpLnRvQmVGYWxzeSgpO1xuICAgIH0pO1xuXG59KTsiLCJmdW5jdGlvbiBmb2xsb3dUcmFqZWN0b3J5KHRyYWplY3RvcnksIHRpbWUpIHtcbiAgICB2YXIgcGVyY2VudGFnZSA9IHRpbWUgLyB0cmFqZWN0b3J5LmR1cmF0aW9uO1xuICAgIHBlcmNlbnRhZ2UgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigxLCBwZXJjZW50YWdlKSk7XG4gICAgdmFyIHggPSB0cmFqZWN0b3J5LnN0YXJ0WCArIHBlcmNlbnRhZ2UqKHRyYWplY3RvcnkuZW5kWCAtIHRyYWplY3Rvcnkuc3RhcnRYKTtcbiAgICB2YXIgeSA9IHRyYWplY3Rvcnkuc3RhcnRZICsgcGVyY2VudGFnZSoodHJhamVjdG9yeS5lbmRZIC0gdHJhamVjdG9yeS5zdGFydFkpO1xuICAgIHZhciBkaXJlY3Rpb24gPSB0cmFqZWN0b3J5LnN0YXJ0RGlyZWN0aW9uICsgcGVyY2VudGFnZSoodHJhamVjdG9yeS5lbmREaXJlY3Rpb24gLSB0cmFqZWN0b3J5LnN0YXJ0RGlyZWN0aW9uKTtcbiAgICBpZiAodHJhamVjdG9yeS50eXBlID09PSBcImFyY1wiKSB7XG4gICAgICAgIHZhciBhcmNBbmdsZSA9IHRyYWplY3RvcnkuYXJjU3RhcnRBbmdsZSArIHBlcmNlbnRhZ2UqKHRyYWplY3RvcnkuYXJjRW5kQW5nbGUgLSB0cmFqZWN0b3J5LmFyY1N0YXJ0QW5nbGUpO1xuICAgICAgICB4ID0gdHJhamVjdG9yeS5hcmNDZW50ZXJYICsgdHJhamVjdG9yeS5hcmNSYWRpdXMqTWF0aC5jb3MoYXJjQW5nbGUpO1xuICAgICAgICB5ID0gdHJhamVjdG9yeS5hcmNDZW50ZXJZICsgdHJhamVjdG9yeS5hcmNSYWRpdXMqTWF0aC5zaW4oYXJjQW5nbGUpO1xuICAgIH1cbiAgICByZXR1cm4geyB4LCB5LCBkaXJlY3Rpb24gfTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVHJhamVjdG9yeSh7IHN0YXJ0WCwgc3RhcnRZLCBzdGFydERpcmVjdGlvbiwgc3BlZWQsIHR1cm5pbmdWZWxvY2l0eSwgZHVyYXRpb24gfSkge1xuICAgIHZhciB0cmFqZWN0b3J5ID0ge1xuICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgc3RhcnRYLFxuICAgICAgICBzdGFydFksXG4gICAgICAgIHN0YXJ0RGlyZWN0aW9uLFxuICAgICAgICBzcGVlZCxcbiAgICAgICAgdHVybmluZ1ZlbG9jaXR5XG4gICAgfTtcblxuICAgIHZhciB4RGlmZiA9IDA7XG4gICAgdmFyIHlEaWZmID0gMDtcbiAgICBpZiAoc3BlZWQgPT09IDApIHtcbiAgICAgICAgLy8gMCBkaWFtZXRlciBhcmNcbiAgICAgICAgdHJhamVjdG9yeS50eXBlID0gXCJzdGlsbF9hcmNcIjtcbiAgICAgICAgeERpZmYgPSAwO1xuICAgICAgICB5RGlmZiA9IDA7XG4gICAgfSBlbHNlIGlmICh0dXJuaW5nVmVsb2NpdHkgPT09IDApIHtcbiAgICAgICAgLy8gU3RyYWlnaHQgbGluZVxuICAgICAgICB0cmFqZWN0b3J5LnR5cGUgPSBcInN0cmFpZ2h0XCI7XG4gICAgICAgIHhEaWZmID0gZHVyYXRpb24gKiBzcGVlZCAqIE1hdGguY29zKHN0YXJ0RGlyZWN0aW9uKTtcbiAgICAgICAgeURpZmYgPSBkdXJhdGlvbiAqIHNwZWVkICogTWF0aC5zaW4oc3RhcnREaXJlY3Rpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIENpcmNsZSBhcmNcbiAgICAgICAgdHJhamVjdG9yeS50eXBlID0gXCJhcmNcIjtcbiAgICAgICAgdmFyIHJhZGl1cyA9IHNwZWVkIC8gdHVybmluZ1ZlbG9jaXR5O1xuICAgICAgICB2YXIgYW5nbGUgPSBkdXJhdGlvbiAqIHR1cm5pbmdWZWxvY2l0eTtcblxuICAgICAgICB0cmFqZWN0b3J5LmFyY0NlbnRlclggPSB0cmFqZWN0b3J5LnN0YXJ0WCAtIHJhZGl1cyAqIE1hdGguY29zKHN0YXJ0RGlyZWN0aW9uIC0gTWF0aC5QSSAvIDIpO1xuICAgICAgICB0cmFqZWN0b3J5LmFyY0NlbnRlclkgPSB0cmFqZWN0b3J5LnN0YXJ0WSAtIHJhZGl1cyAqIE1hdGguc2luKHN0YXJ0RGlyZWN0aW9uIC0gTWF0aC5QSSAvIDIpO1xuICAgICAgICB0cmFqZWN0b3J5LmFyY1JhZGl1cyA9IE1hdGguYWJzKHJhZGl1cyk7XG4gICAgICAgIHRyYWplY3RvcnkuYXJjU3RhcnRBbmdsZSA9IHN0YXJ0RGlyZWN0aW9uIC0gcmFkaXVzIC8gTWF0aC5hYnMocmFkaXVzKSAqIE1hdGguUEkgLyAyO1xuICAgICAgICB0cmFqZWN0b3J5LmFyY0FuZ2xlRGlmZiA9IGFuZ2xlO1xuICAgICAgICB0cmFqZWN0b3J5LmFyY0VuZEFuZ2xlID0gdHJhamVjdG9yeS5hcmNTdGFydEFuZ2xlICsgdHJhamVjdG9yeS5hcmNBbmdsZURpZmY7XG5cbiAgICAgICAgeERpZmYgPSAtcmFkaXVzICogKE1hdGguY29zKHN0YXJ0RGlyZWN0aW9uIC0gTWF0aC5QSSAvIDIpICsgTWF0aC5jb3Moc3RhcnREaXJlY3Rpb24gKyBNYXRoLlBJIC8gMiArIGFuZ2xlKSk7XG4gICAgICAgIHlEaWZmID0gLXJhZGl1cyAqIChNYXRoLnNpbihzdGFydERpcmVjdGlvbiAtIE1hdGguUEkgLyAyKSArIE1hdGguc2luKHN0YXJ0RGlyZWN0aW9uICsgTWF0aC5QSSAvIDIgKyBhbmdsZSkpO1xuICAgIH1cbiAgICB0cmFqZWN0b3J5LmVuZFggPSB0cmFqZWN0b3J5LnN0YXJ0WCArIHhEaWZmO1xuICAgIHRyYWplY3RvcnkuZW5kWSA9IHRyYWplY3Rvcnkuc3RhcnRZICsgeURpZmY7XG4gICAgdHJhamVjdG9yeS5lbmREaXJlY3Rpb24gPSB0cmFqZWN0b3J5LnN0YXJ0RGlyZWN0aW9uICsgdHVybmluZ1ZlbG9jaXR5ICogZHVyYXRpb247XG4gICAgcmV0dXJuIHRyYWplY3Rvcnk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGNyZWF0ZVRyYWplY3RvcnksXG4gICAgZm9sbG93VHJhamVjdG9yeVxufTtcbiIsInZhciBjbG9uZSA9IHJlcXVpcmUoXCIuL2Nsb25lXCIpO1xuXG5kZXNjcmliZShcImNsb25lXCIsIGZ1bmN0aW9uICgpIHtcblxuICAgIGl0KFwidGVzdCBiYXNpYyBjbG9uaW5nXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG9iamVjdCA9IHtcbiAgICAgICAgICAgIDE6IHtcbiAgICAgICAgICAgICAgICBkZWVwTGlzdDogW11cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsaXN0OiBbXVxuICAgICAgICB9O1xuXG4gICAgICAgIGV4cGVjdChjbG9uZShvYmplY3QpKS50b0VxdWFsKG9iamVjdCk7XG4gICAgfSk7XG5cbiAgICBpdChcInRlc3QgZGVlcCBjbG9uaW5nXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG9iamVjdCA9IHtcbiAgICAgICAgICAgIDE6IHtcbiAgICAgICAgICAgICAgICBkZWVwTGlzdDogW11cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsaXN0OiBbXVxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBjbG9uZWRPYmplY3QgPSBjbG9uZShvYmplY3QpO1xuICAgICAgICBjbG9uZWRPYmplY3QubGlzdC5wdXNoKDEpO1xuICAgICAgICBjbG9uZWRPYmplY3RbMV0uZGVlcExpc3QucHVzaCgyKTtcbiAgICAgICAgZXhwZWN0KG9iamVjdCkudG9FcXVhbCh7XG4gICAgICAgICAgICAxOiB7XG4gICAgICAgICAgICAgICAgZGVlcExpc3Q6IFtdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbGlzdDogW11cbiAgICAgICAgfSk7XG5cbiAgICAgICAgZXhwZWN0KGNsb25lZE9iamVjdCkudG9FcXVhbCh7XG4gICAgICAgICAgICAxOiB7XG4gICAgICAgICAgICAgICAgZGVlcExpc3Q6IFsyXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxpc3Q6IFsxXVxuICAgICAgICB9KTtcbiAgICB9KTtcbn0pOyIsImZ1bmN0aW9uIGlzUHJpbWl0aXZlKG9iamVjdCkge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqZWN0ICE9PSAnb2JqZWN0JyB8fCAgb2JqZWN0ID09PSBudWxsIHx8IG9iamVjdCA9PT0gdW5kZWZpbmVkXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2xvbmUoc291cmNlKSB7XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShzb3VyY2UpKSB7XG4gICAgICAgIHZhciBjbG9uZWRBcnJheSA9IFtdO1xuICAgICAgICBzb3VyY2UuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgaWYgKGlzUHJpbWl0aXZlKGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgY2xvbmVkQXJyYXkucHVzaChpdGVtKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2xvbmVkQXJyYXkucHVzaChjbG9uZShpdGVtKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gY2xvbmVkQXJyYXk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGNsb25lZE9iamVjdCA9IHt9O1xuICAgICAgICBmb3IgKHZhciBwcm9wIGluIHNvdXJjZSkge1xuICAgICAgICAgICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHNvdXJjZVtwcm9wXTtcbiAgICAgICAgICAgICAgICBpZiAoaXNQcmltaXRpdmUodmFsdWUpKXtcbiAgICAgICAgICAgICAgICAgICAgY2xvbmVkT2JqZWN0W3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2xvbmVkT2JqZWN0W3Byb3BdID0gY2xvbmUodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjbG9uZWRPYmplY3Q7XG4gICAgfVxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZvckVhY2goY29sbGVjdGlvbiwgY2FsbGJhY2spIHtcbiAgICBmb3IgKHZhciBrIGluIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgaWYgKGNvbGxlY3Rpb24uaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGNvbGxlY3Rpb25ba10sIGspO1xuICAgICAgICB9XG4gICAgfVxufTsiLCJ2YXIgdXRpbHMgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG51dGlscy5nZXRJbmRleCA9IGZ1bmN0aW9uIGdldEluZGV4KGdyaWQsIHJvdywgY29sKSB7XG4gICAgcmV0dXJuIHJvdyAqIGdyaWQuY29scyArIGNvbDtcbn07XG5cbnV0aWxzLmdldFJvd0NvbCA9IGZ1bmN0aW9uIGdldFJvd0NvbChncmlkLCBpbmRleCkge1xuICAgIHZhciByb3dDb2wgPSB7fTtcbiAgICByb3dDb2wucm93ID0gTWF0aC5mbG9vcihpbmRleCAvIGdyaWQuY29scyk7XG4gICAgcm93Q29sLmNvbCA9IGluZGV4IC0gcm93Q29sLnJvdyAqIGdyaWQuY29scztcbiAgICByZXR1cm4gcm93Q29sO1xufTtcblxudXRpbHMuaXNJbnNpZGVHcmlkID0gZnVuY3Rpb24gaXNJbnNpZGVHcmlkKGdyaWQsIHJvdywgY29sKSB7XG4gICAgcmV0dXJuIHJvdyA+PSAwICYmIHJvdyA8IGdyaWQucm93cyAmJiBjb2wgPj0gMCAmJiBjb2wgPCBncmlkLmNvbHM7XG59OyJdfQ==
