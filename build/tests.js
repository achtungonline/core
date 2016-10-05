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
        expect(gsf.getPlayer(gsf.createGameState({ players: [{ id: "0" }], worms: [{ id: "1", playerId: "0" }] }), "1")).toEqual({ id: 0 });
        expect(gsf.getPlayer(gsf.createGameState({ players: [{ id: "0" }], worms: [{ id: "1", playerId: "0" }] }), "1")).toEqual({ id: 0 });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29yZS9jb25zdGFudHMuanMiLCJzcmMvY29yZS9nYW1lLXN0YXRlLWZ1bmN0aW9ucy1zcGVjLmpzIiwic3JjL2NvcmUvZ2FtZS1zdGF0ZS1mdW5jdGlvbnMuanMiLCJzcmMvY29yZS9nZW9tZXRyeS9zaGFwZS1mYWN0b3J5LmpzIiwic3JjL2NvcmUvZ2VvbWV0cnkvc2hhcGUtc3BhdGlhbC1yZWxhdGlvbnMuanMiLCJzcmMvY29yZS9nZW9tZXRyeS9zaGFwZS10by1ncmlkLWNvbnZlcnRlci5qcyIsInNyYy9jb3JlL2dlb21ldHJ5L3Rlc3Qvc2hhcGUtc3BhdGlhbC1yZWxhdGlvbnMtc3BlYy5qcyIsInNyYy9jb3JlL2dlb21ldHJ5L3RyYWplY3RvcnkvdHJhamVjdG9yeS11dGlsLmpzIiwic3JjL2NvcmUvdXRpbC9jbG9uZS1zcGVjLmpzIiwic3JjL2NvcmUvdXRpbC9jbG9uZS5qcyIsInNyYy9jb3JlL3V0aWwvZm9yLWVhY2guanMiLCJzcmMvY29yZS91dGlsL2dyaWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQUksZUFBZSxRQUFuQixBQUFtQixBQUFRO0FBQzNCLElBQUksVUFBVSxRQUFkLEFBQWMsQUFBUTs7QUFFdEIsSUFBSTtVQUFhLEFBQ1AsQUFDTjtVQUZhLEFBRVAsQUFDTjtXQUhhLEFBR04sQUFDUDtZQUphLEFBSUwsQUFDUjtZQUxhLEFBS0wsQUFDUjtVQU5hLEFBTVAsQUFDTjtZQVBhLEFBT0wsQUFDUjtVQVJhLEFBUVAsQUFDTjtXQVRhLEFBU04sQUFDUDtjQVZKLEFBQWlCLEFBVUg7QUFWRyxBQUNiO0FBV0osSUFBSSxlQUFKLEFBQW1CO0FBQ25CLFFBQUEsQUFBUSxZQUFZLFVBQUEsQUFBQyxPQUFELEFBQU8sSUFBUDtXQUFjLGFBQUEsQUFBYSxLQUEzQixBQUFjLEFBQWtCO0FBQXBEOztBQUVBLElBQUkscUJBQUosQUFB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QUFpQixZQUFqQixBQUE2QixVQUFVLEFBQ3BEO1NBQUssSUFBTCxBQUFTLEtBQVQsQUFBYyxZQUFZLEFBQ3RCO1lBQUksV0FBQSxBQUFXLGVBQWYsQUFBSSxBQUEwQixJQUFJLEFBQzlCO3FCQUFTLFdBQVQsQUFBUyxBQUFXLElBQXBCLEFBQXdCLEFBQzNCO0FBQ0o7QUFDSjtBQU5EOzs7OztBQ0FBLElBQUksUUFBUSxPQUFBLEFBQU8sVUFBbkIsQUFBNkI7O0FBRTdCLE1BQUEsQUFBTSxXQUFXLFNBQUEsQUFBUyxTQUFULEFBQWtCLE1BQWxCLEFBQXdCLEtBQXhCLEFBQTZCLEtBQUssQUFDL0M7V0FBTyxNQUFNLEtBQU4sQUFBVyxPQUFsQixBQUF5QixBQUM1QjtBQUZEOztBQUlBLE1BQUEsQUFBTSxZQUFZLFNBQUEsQUFBUyxVQUFULEFBQW1CLE1BQW5CLEFBQXlCLE9BQU8sQUFDOUM7UUFBSSxTQUFKLEFBQWEsQUFDYjtXQUFBLEFBQU8sTUFBTSxLQUFBLEFBQUssTUFBTSxRQUFRLEtBQWhDLEFBQWEsQUFBd0IsQUFDckM7V0FBQSxBQUFPLE1BQU0sUUFBUSxPQUFBLEFBQU8sTUFBTSxLQUFsQyxBQUF1QyxBQUN2QztXQUFBLEFBQU8sQUFDVjtBQUxEOztBQU9BLE1BQUEsQUFBTSxlQUFlLFNBQUEsQUFBUyxhQUFULEFBQXNCLE1BQXRCLEFBQTRCLEtBQTVCLEFBQWlDLEtBQUssQUFDdkQ7V0FBTyxPQUFBLEFBQU8sS0FBSyxNQUFNLEtBQWxCLEFBQXVCLFFBQVEsT0FBL0IsQUFBc0MsS0FBSyxNQUFNLEtBQXhELEFBQTZELEFBQ2hFO0FBRkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHNoYXBlRmFjdG9yeSA9IHJlcXVpcmUoXCIuL2dlb21ldHJ5L3NoYXBlLWZhY3RvcnkuanNcIik7XG52YXIgZm9yRWFjaCA9IHJlcXVpcmUoXCIuL3V0aWwvZm9yLWVhY2guanNcIik7XG5cbnZhciB3b3JtQ29sb3JzID0ge1xuICAgIGJsdWU6IFwiIzAzQTlGNFwiLFxuICAgIHBpbms6IFwiI0U5MUU2M1wiLFxuICAgIGdyZWVuOiBcIiM0Q0FGNTBcIixcbiAgICBwdXJwbGU6IFwiIzlDMjdCMFwiLFxuICAgIG9yYW5nZTogXCIjRkY5ODAwXCIsXG4gICAgbGltZTogXCIjQ0REQzM5XCIsXG4gICAgaW5kaWdvOiBcIiMzRjUxQjVcIixcbiAgICB0ZWFsOiBcIiMwMDk2ODhcIixcbiAgICBibGFjazogXCIjNDQ0XCIsXG4gICAgYmx1ZWdyZXk6IFwiIzYwN0Q4QlwiXG59O1xudmFyIHdvcm1Db2xvcklkcyA9IFtdO1xuZm9yRWFjaCh3b3JtQ29sb3JzLCAoY29sb3IsaWQpID0+IHdvcm1Db2xvcklkcy5wdXNoKGlkKSk7XG5cbnZhciBwb3dlclVwRGVmaW5pdGlvbnMgPSB7fTtcbnBvd2VyVXBEZWZpbml0aW9uc1tcInNwZWVkXCJdID0ge1xuICAgIG5hbWU6IFwic3BlZWRcIixcbiAgICBlZmZlY3RUeXBlOiBcInNwZWVkXCIsXG4gICAgZWZmZWN0RHVyYXRpb246IDUsXG4gICAgZWZmZWN0U3RyZW5ndGg6IDMgLyAyLFxuICAgIHdlaWdodGVkU3Bhd25DaGFuY2U6IDEsXG4gICAgYWZmZWN0czogXCJzZWxmXCJcbn07XG5wb3dlclVwRGVmaW5pdGlvbnNbXCJzbG93XCJdID0ge1xuICAgIG5hbWU6IFwic2xvd1wiLFxuICAgIGVmZmVjdFR5cGU6IFwic3BlZWRcIixcbiAgICBlZmZlY3REdXJhdGlvbjogNSxcbiAgICBlZmZlY3RTdHJlbmd0aDogMiAvIDMsXG4gICAgd2VpZ2h0ZWRTcGF3bkNoYW5jZTogMSxcbiAgICBhZmZlY3RzOiBcIm90aGVyc1wiXG59O1xucG93ZXJVcERlZmluaXRpb25zW1wiZmF0XCJdID0ge1xuICAgIG5hbWU6IFwiZmF0XCIsXG4gICAgZWZmZWN0VHlwZTogXCJzaXplXCIsXG4gICAgZWZmZWN0RHVyYXRpb246IDUsXG4gICAgZWZmZWN0U3RyZW5ndGg6IDIsXG4gICAgd2VpZ2h0ZWRTcGF3bkNoYW5jZTogMSxcbiAgICBhZmZlY3RzOiBcIm90aGVyc1wiXG59O1xucG93ZXJVcERlZmluaXRpb25zW1wic2xpbVwiXSA9IHtcbiAgICBuYW1lOiBcInNsaW1cIixcbiAgICBlZmZlY3RUeXBlOiBcInNpemVcIixcbiAgICBlZmZlY3REdXJhdGlvbjogNSxcbiAgICBlZmZlY3RTdHJlbmd0aDogMC41LFxuICAgIHdlaWdodGVkU3Bhd25DaGFuY2U6IDEsXG4gICAgYWZmZWN0czogXCJzZWxmXCJcbn07XG5wb3dlclVwRGVmaW5pdGlvbnNbXCJxdWlja190dXJuXCJdID0ge1xuICAgIG5hbWU6IFwicXVpY2tfdHVyblwiLFxuICAgIGVmZmVjdFR5cGU6IFwidHVybmluZ1NwZWVkXCIsXG4gICAgZWZmZWN0RHVyYXRpb246IDUsXG4gICAgZWZmZWN0U3RyZW5ndGg6IDMgLyAyLFxuICAgIHdlaWdodGVkU3Bhd25DaGFuY2U6IDEsXG4gICAgYWZmZWN0czogXCJzZWxmXCJcbn07XG5wb3dlclVwRGVmaW5pdGlvbnNbXCJzbG93X3R1cm5cIl0gPSB7XG4gICAgbmFtZTogXCJzbG93X3R1cm5cIixcbiAgICBlZmZlY3RUeXBlOiBcInR1cm5pbmdTcGVlZFwiLFxuICAgIGVmZmVjdER1cmF0aW9uOiA1LFxuICAgIGVmZmVjdFN0cmVuZ3RoOiAyIC8gMyxcbiAgICB3ZWlnaHRlZFNwYXduQ2hhbmNlOiAxLFxuICAgIGFmZmVjdHM6IFwib3RoZXJzXCJcbn07XG5wb3dlclVwRGVmaW5pdGlvbnNbXCJzd2l0Y2hhcm9vbmllXCJdID0ge1xuICAgIG5hbWU6IFwic3dpdGNoYXJvb25pZVwiLFxuICAgIGVmZmVjdFR5cGU6IFwid29ybVN3aXRjaFwiLFxuICAgIHdlaWdodGVkU3Bhd25DaGFuY2U6IDEwMDAuNSxcbiAgICBhZmZlY3RzOiBcImFsbFwiXG59O1xucG93ZXJVcERlZmluaXRpb25zW1wia2V5X3N3aXRjaFwiXSA9IHtcbiAgICBuYW1lOiBcImtleV9zd2l0Y2hcIixcbiAgICBlZmZlY3RUeXBlOiBcInR1cm5pbmdTcGVlZFwiLFxuICAgIGVmZmVjdER1cmF0aW9uOiA1LFxuICAgIGVmZmVjdFN0cmVuZ3RoOiAtMSxcbiAgICB3ZWlnaHRlZFNwYXduQ2hhbmNlOiAxLFxuICAgIGFmZmVjdHM6IFwib3RoZXJzXCJcbn07XG5wb3dlclVwRGVmaW5pdGlvbnNbXCJkcnVua1wiXSA9IHtcbiAgICBuYW1lOiBcImRydW5rXCIsXG4gICAgZWZmZWN0VHlwZTogXCJkcnVua1wiLFxuICAgIGVmZmVjdER1cmF0aW9uOiA1LFxuICAgIGVmZmVjdFN0cmVuZ3RoOiAxLFxuICAgIHdlaWdodGVkU3Bhd25DaGFuY2U6IDEsXG4gICAgYWZmZWN0czogXCJvdGhlcnNcIlxufTtcbnBvd2VyVXBEZWZpbml0aW9uc1tcImNsZWFyX2FsbFwiXSA9IHtcbiAgICBuYW1lOiBcImNsZWFyXCIsXG4gICAgZWZmZWN0VHlwZTogXCJjbGVhclwiLFxuICAgIHdlaWdodGVkU3Bhd25DaGFuY2U6IDEwMDAuMjUsXG4gICAgYWZmZWN0czogXCJhbGxcIlxufTtcbnBvd2VyVXBEZWZpbml0aW9uc1tcImNsZWFyX3NlbGZcIl0gPSB7XG4gICAgbmFtZTogXCJjbGVhclwiLFxuICAgIGVmZmVjdFR5cGU6IFwiY2xlYXJcIixcbiAgICB3ZWlnaHRlZFNwYXduQ2hhbmNlOiAxMDAwLjI1LFxuICAgIGFmZmVjdHM6IFwic2VsZlwiXG59O1xucG93ZXJVcERlZmluaXRpb25zW1wiY2xlYXJfb3RoZXJzXCJdID0ge1xuICAgIG5hbWU6IFwiY2xlYXJcIixcbiAgICBlZmZlY3RUeXBlOiBcImNsZWFyXCIsXG4gICAgd2VpZ2h0ZWRTcGF3bkNoYW5jZTogMTAwMC4yNSxcbiAgICBhZmZlY3RzOiBcIm90aGVyc1wiXG59O1xucG93ZXJVcERlZmluaXRpb25zW1wic3VwZXJfanVtcFwiXSA9IHtcbiAgICBuYW1lOiBcInN1cGVyX2p1bXBcIixcbiAgICBlZmZlY3RUeXBlOiBcInN1cGVySnVtcFwiLFxuICAgIGVmZmVjdER1cmF0aW9uOiA1LFxuICAgIHdlaWdodGVkU3Bhd25DaGFuY2U6IDEsXG4gICAgYWZmZWN0czogXCJzZWxmXCJcbn07XG5wb3dlclVwRGVmaW5pdGlvbnNbXCJ0cm9uX3R1cm5cIl0gPSB7XG4gICAgbmFtZTogXCJ0cm9uX3R1cm5cIixcbiAgICBlZmZlY3RUeXBlOiBcInRyb25UdXJuXCIsXG4gICAgZWZmZWN0RHVyYXRpb246IDUsXG4gICAgd2VpZ2h0ZWRTcGF3bkNoYW5jZTogMSxcbiAgICBhZmZlY3RzOiBcIm90aGVyc1wiXG59O1xucG93ZXJVcERlZmluaXRpb25zW1widHdpblwiXSA9IHtcbiAgICBuYW1lOiBcInR3aW5cIixcbiAgICBlZmZlY3RUeXBlOiBcInR3aW5cIixcbiAgICBlZmZlY3REdXJhdGlvbjogNSxcbiAgICB3ZWlnaHRlZFNwYXduQ2hhbmNlOiAxLFxuICAgIGFmZmVjdHM6IFwic2VsZlwiXG59O1xuXG5wb3dlclVwRGVmaW5pdGlvbnNbXCJ3YWxsX2hhY2tfc2VsZlwiXSA9IHtcbiAgICBuYW1lOiBcIndhbGxfaGFja1wiLFxuICAgIGVmZmVjdFR5cGU6IFwid2FsbEhhY2tcIixcbiAgICBlZmZlY3REdXJhdGlvbjogNSxcbiAgICB3ZWlnaHRlZFNwYXduQ2hhbmNlOiAwLjUsXG4gICAgYWZmZWN0czogXCJzZWxmXCJcbn07XG5cbnBvd2VyVXBEZWZpbml0aW9uc1tcIndhbGxfaGFja19hbGxcIl0gPSB7XG4gICAgbmFtZTogXCJ3YWxsX2hhY2tcIixcbiAgICBlZmZlY3RUeXBlOiBcIndhbGxIYWNrXCIsXG4gICAgZWZmZWN0RHVyYXRpb246IDUsXG4gICAgd2VpZ2h0ZWRTcGF3bkNoYW5jZTogMC41LFxuICAgIGFmZmVjdHM6IFwiYWxsXCJcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIFNUQVJUX1BIQVNFX0RVUkFUSU9OOiAyLjUsXG4gICAgU1RBUlRfRElTVEFOQ0VfVE9fTUFQOiA1MCxcbiAgICBTVEFSVF9ESVNUQU5DRV9UT19XT1JNUzogNzAsXG5cbiAgICB3b3JtQ29sb3JzLFxuICAgIHdvcm1Db2xvcklkcyxcblxuICAgIHBvd2VyVXBEZWZpbml0aW9ucyxcbiAgICBQT1dFUl9VUF9TUEFXTl9DSEFOQ0U6IDAuMTIsICAgICAgICAgICAgLy8gSW52ZXJzZSBvZiBtYXhpbXVtIHRpbWUgYmV0d2VlbiBwb3dlciB1cCBzcGF3bnMgKHNlY29uZHMpLiAwLjEgbWVhbnMgbWF4IDEwIHNlY29uZHMsIGF2ZXJhZ2UgNSBzZWNvbmRzLlxuICAgIFBPV0VSX1VQX1NIQVBFOiBzaGFwZUZhY3RvcnkuY3JlYXRlQ2lyY2xlKDI1KSxcblxuICAgIFdPUk1fUkFESVVTOiA0LFxuICAgIFdPUk1fU1BFRUQ6IDkwLFxuICAgIFdPUk1fVFVSTklOR19TUEVFRDogMyxcblxuICAgIEpVTVBfQ09PTERPV046IDEuNSwgICAgICAgICAgICAgICAgLy8gQWZ0ZXIgYSBqdW1wLCB0aGlzIGlzIHRoZSBtaW5pbXVtIHdhaXRpbmcgdGltZSB1bnRpbCBhbm90aGVyIGp1bXBcbiAgICBKVU1QX0xFTkdUSDogMzAsICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIGxlbmd0aCBvZiBhIGp1bXBcbiAgICBKVU1QX0NIQU5DRTogMC40LCAgICAgICAgICAgICAgICAgICAgICAgLy8gMC41IG1lYW5zIDUwICUgY2hhbmNlIG9mIGp1bXAgYWZ0ZXIgMSBzZWNvbmQgaGFzIHBhc3NlZCAoYWZ0ZXIgdGhlIEpVTVBfQ09PTERPV04gaGFzIHBhc3NlZCkuXG5cbiAgICBJTU1VTklUWV9ESVNUQU5DRV9NVUxUSVBMSUVSOiA2LFxuXG4gICAgU1RFRVJJTkdfU1RSQUlHSFQ6IDAsXG4gICAgU1RFRVJJTkdfTEVGVDogLTEsXG4gICAgU1RFRVJJTkdfUklHSFQ6IDEsXG5cbiAgICBQTEFZX0FSRUFfRlJFRTogLTEsXG4gICAgUExBWV9BUkVBX09CU1RBQ0xFOiAtMlxufTsiLCJ2YXIgZ3NmID0gcmVxdWlyZShcIi4vZ2FtZS1zdGF0ZS1mdW5jdGlvbnMuanNcIik7XG5cbi8vamFzbWluZS5wcCA9IGZ1bmN0aW9uIChvYmopIHtcbi8vICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmosIHVuZGVmaW5lZCwgMik7XG4vL307XG5cbmRlc2NyaWJlKFwiZ2FtZS1zdGF0ZS1mdW5jdGlvbnNcIiwgZnVuY3Rpb24gKCkge1xuXG4gICAgaXQoXCJnZXRQbGF5ZXJcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBleHBlY3QoKCkgPT4gZ3NmLmdldFBsYXllcihnc2YuY3JlYXRlR2FtZVN0YXRlKHt9KSkpLnRvVGhyb3coKTtcbiAgICAgICAgZXhwZWN0KCgpID0+IGdzZi5nZXRQbGF5ZXIoZ3NmLmNyZWF0ZUdhbWVTdGF0ZSh7fSksIFwiMFwiKSkudG9UaHJvdygpO1xuXG4gICAgICAgIGV4cGVjdChnc2YuZ2V0UGxheWVyKGdzZi5jcmVhdGVHYW1lU3RhdGUoe3BsYXllcnM6IFt7aWQ6IFwiMFwifV19KSwgXCIwXCIpKS50b0VxdWFsKHtpZDogXCIwXCJ9KTtcbiAgICAgICAgZXhwZWN0KGdzZi5nZXRQbGF5ZXIoZ3NmLmNyZWF0ZUdhbWVTdGF0ZSh7cGxheWVyczogW3tpZDogXCIwXCJ9XSwgd29ybXM6IFt7aWQ6IFwiMVwiLCBwbGF5ZXJJZDogXCIwXCJ9XX0pLCBcIjFcIikpLnRvRXF1YWwoe2lkOiAwfSk7XG4gICAgICAgIGV4cGVjdChnc2YuZ2V0UGxheWVyKGdzZi5jcmVhdGVHYW1lU3RhdGUoe3BsYXllcnM6IFt7aWQ6IFwiMFwifV0sIHdvcm1zOiBbe2lkOiBcIjFcIiwgcGxheWVySWQ6IFwiMFwifV19KSwgXCIxXCIpKS50b0VxdWFsKHtpZDogMH0pO1xuICAgICAgICBleHBlY3QoZ3NmLmdldFBsYXllcihnc2YuY3JlYXRlR2FtZVN0YXRlKHtwbGF5ZXJzOiBbe2lkOiBcIjBcIn1dLCB3b3JtUGF0aFNlZ21lbnRzOiB7XCIxXCI6IFt7cGxheWVySWQ6IFwiMFwifV19fSksIFwiMVwiKSkudG9FcXVhbCh7aWQ6IFwiMFwifSk7XG4gICAgfSk7XG5cbiAgICBpdChcImFkZFdvcm1QYXRoU2VnbWVudE1ldGFEYXRhXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGdhbWVTdGF0ZSA9IGdzZi5jcmVhdGVTaW1wbGVHYW1lU3RhdGUoe1xuICAgICAgICAgICAgd29ybVBhdGhTZWdtZW50czoge1xuICAgICAgICAgICAgICAgIDA6IFtcbiAgICAgICAgICAgICAgICAgICAge3NvbWVWYWx1ZTogXCJzb21ldGhpbmdcIiwgbWV0YURhdGE6IFtdfV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGdzZi5hZGRXb3JtUGF0aFNlZ21lbnRNZXRhRGF0YShnYW1lU3RhdGUsIDAsIHt0eXBlOiBcImNsZWFyXCJ9LCBmYWxzZSk7XG4gICAgICAgIGV4cGVjdChnYW1lU3RhdGUpLnRvRXF1YWwoe1xuICAgICAgICAgICAgd29ybVBhdGhTZWdtZW50czoge1xuICAgICAgICAgICAgICAgIDA6IFtcbiAgICAgICAgICAgICAgICAgICAge3NvbWVWYWx1ZTogXCJzb21ldGhpbmdcIiwgbWV0YURhdGE6IFt7dHlwZTogXCJjbGVhclwifV19XVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBnYW1lU3RhdGUgPSBnc2YuY3JlYXRlU2ltcGxlR2FtZVN0YXRlKHtcbiAgICAgICAgICAgIGdhbWVUaW1lOiAyMDAsXG4gICAgICAgICAgICB3b3JtUGF0aFNlZ21lbnRzOiB7XG4gICAgICAgICAgICAgICAgMDogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMC45MDIwMDAwMDAwMDAwMDA2LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRYOiA0NTQuMTAyMTU4NjY1MDAyOSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0WTogMTA5LjY3MzgyNzQ2MDYyOTExLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnREaXJlY3Rpb246IDEyLjMzMzk3MTczOTI1NDk4OCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwZWVkOiA5MCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR1cm5pbmdWZWxvY2l0eTogMyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYXJjXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmNDZW50ZXJYOiA0NjEuMDExNTM1NzQ3MzA3NyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyY0NlbnRlclk6IDEzOC44NjczMjg1OTI0NjUzLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJjUmFkaXVzOiAzMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyY1N0YXJ0QW5nbGU6IDEwLjc2MzE3NTQxMjQ2MDA5MSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyY0FuZ2xlRGlmZjogMi43MDYwMDAwMDAwMDAwMDEzLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJjRW5kQW5nbGU6IDEzLjQ2OTE3NTQxMjQ2MDA5OCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZFg6IDQ3OS41OTM4NDkzMTQ5NixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZFk6IDE2Mi40MTkzNDgwOTEyOTg2NCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZERpcmVjdGlvbjogMTUuMDM5OTcxNzM5MjU0OTk1LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lOiAyNi43NjE5OTk5OTk5OTkzNSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZFRpbWU6IDI3LjY2Mzk5OTk5OTk5OTMxMixcbiAgICAgICAgICAgICAgICAgICAgICAgIGp1bXA6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZTogNCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllcklkOiBcInBsYXllcl8xXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB3b3JtSWQ6IFwid29ybV8wXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRhRGF0YTogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleDogMFxuICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBnc2YuYWRkV29ybVBhdGhTZWdtZW50TWV0YURhdGEoZ2FtZVN0YXRlLCAwLCB7dHlwZTogXCJjbGVhclwifSwgdHJ1ZSk7XG4gICAgICAgIGV4cGVjdChnYW1lU3RhdGUpLnRvRXF1YWwoe1xuICAgICAgICAgICAgZ2FtZVRpbWU6IDIwMCxcbiAgICAgICAgICAgIHdvcm1QYXRoU2VnbWVudHM6IHtcbiAgICAgICAgICAgICAgICAwOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAwLjkwMjAwMDAwMDAwMDAwMDYsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydFg6IDQ1NC4xMDIxNTg2NjUwMDI5LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRZOiAxMDkuNjczODI3NDYwNjI5MTEsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydERpcmVjdGlvbjogMTIuMzMzOTcxNzM5MjU0OTg4LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3BlZWQ6IDkwLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHVybmluZ1ZlbG9jaXR5OiAzLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJhcmNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyY0NlbnRlclg6IDQ2MS4wMTE1MzU3NDczMDc3LFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJjQ2VudGVyWTogMTM4Ljg2NzMyODU5MjQ2NTMsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmNSYWRpdXM6IDMwLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJjU3RhcnRBbmdsZTogMTAuNzYzMTc1NDEyNDYwMDkxLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJjQW5nbGVEaWZmOiAyLjcwNjAwMDAwMDAwMDAwMTMsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmNFbmRBbmdsZTogMTMuNDY5MTc1NDEyNDYwMDk4LFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kWDogNDc5LjU5Mzg0OTMxNDk2LFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kWTogMTYyLjQxOTM0ODA5MTI5ODY0LFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kRGlyZWN0aW9uOiAxNS4wMzk5NzE3MzkyNTQ5OTUsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydFRpbWU6IDI2Ljc2MTk5OTk5OTk5OTM1LFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kVGltZTogMjcuNjYzOTk5OTk5OTk5MzEyLFxuICAgICAgICAgICAgICAgICAgICAgICAganVtcDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaXplOiA0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVySWQ6IFwicGxheWVyXzFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvcm1JZDogXCJ3b3JtXzBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGFEYXRhOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4OiAwXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRYOiA0NzkuNTkzODQ5MzE0OTYsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydFk6IDE2Mi40MTkzNDgwOTEyOTg2NCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0RGlyZWN0aW9uOiAxNS4wMzk5NzE3MzkyNTQ5OTUsXG4gICAgICAgICAgICAgICAgICAgICAgICBzcGVlZDogOTAsXG4gICAgICAgICAgICAgICAgICAgICAgICB0dXJuaW5nVmVsb2NpdHk6IDMsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImFyY1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJjQ2VudGVyWDogNDYxLjAxMTUzNTc0NzMwNzk2LFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJjQ2VudGVyWTogMTM4Ljg2NzMyODU5MjQ2NDY0LFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJjUmFkaXVzOiAzMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyY1N0YXJ0QW5nbGU6IDEzLjQ2OTE3NTQxMjQ2MDA5OCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyY0FuZ2xlRGlmZjogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyY0VuZEFuZ2xlOiAxMy40NjkxNzU0MTI0NjAwOTgsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRYOiA0NzkuNTkzODQ5MzE0OTU5OSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZFk6IDE2Mi40MTkzNDgwOTEyOTg2NyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZERpcmVjdGlvbjogMTUuMDM5OTcxNzM5MjU0OTk1LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRUaW1lOiAyMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRUaW1lOiAyMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBqdW1wOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpemU6IDQsXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXJJZDogXCJwbGF5ZXJfMVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgd29ybUlkOiBcIndvcm1fMFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0YURhdGE6IFt7dHlwZTogXCJjbGVhclwifV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleDogMVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0WDogNDc5LjU5Mzg0OTMxNDk2LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRZOiAxNjIuNDE5MzQ4MDkxMjk4NjQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydERpcmVjdGlvbjogMTUuMDM5OTcxNzM5MjU0OTk1LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3BlZWQ6IDkwLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHVybmluZ1ZlbG9jaXR5OiAzLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJhcmNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyY0NlbnRlclg6IDQ2MS4wMTE1MzU3NDczMDc5NixcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyY0NlbnRlclk6IDEzOC44NjczMjg1OTI0NjQ2NCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyY1JhZGl1czogMzAsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmNTdGFydEFuZ2xlOiAxMy40NjkxNzU0MTI0NjAwOTgsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmNBbmdsZURpZmY6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmNFbmRBbmdsZTogMTMuNDY5MTc1NDEyNDYwMDk4LFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kWDogNDc5LjU5Mzg0OTMxNDk1OTksXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRZOiAxNjIuNDE5MzQ4MDkxMjk4NjcsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmREaXJlY3Rpb246IDE1LjAzOTk3MTczOTI1NDk5NSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VGltZTogMjAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kVGltZTogMjAwLFxuICAgICAgICAgICAgICAgICAgICAgICAganVtcDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaXplOiA0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVySWQ6IFwicGxheWVyXzFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvcm1JZDogXCJ3b3JtXzBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGFEYXRhOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4OiAyXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7IiwidmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoXCIuL2NvbnN0YW50cy5qc1wiKTtcbnZhciBzaGFwZUZhY3RvcnkgPSByZXF1aXJlKFwiLi9nZW9tZXRyeS9zaGFwZS1mYWN0b3J5LmpzXCIpO1xudmFyIHNoYXBlVG9HcmlkQ29udmVydGVyID0gcmVxdWlyZShcIi4vZ2VvbWV0cnkvc2hhcGUtdG8tZ3JpZC1jb252ZXJ0ZXIuanNcIikuY3JlYXRlU2hhcGVUb0dyaWRDb252ZXJ0ZXIoKTtcbnZhciBmb3JFYWNoID0gcmVxdWlyZShcIi4vdXRpbC9mb3ItZWFjaC5qc1wiKTtcbnZhciB0cmFqZWN0b3J5VXRpbCA9IHJlcXVpcmUoXCIuL2dlb21ldHJ5L3RyYWplY3RvcnkvdHJhamVjdG9yeS11dGlsLmpzXCIpO1xudmFyIGNsb25lID0gcmVxdWlyZShcIi4vdXRpbC9jbG9uZS5qc1wiKTtcblxuZnVuY3Rpb24gYWRkRWZmZWN0KGdhbWVTdGF0ZSwgZWZmZWN0KSB7XG4gICAgZWZmZWN0LmlkID0gZ2V0TmV4dElkKGdhbWVTdGF0ZSwgXCJlZmZlY3RcIik7XG4gICAgZ2FtZVN0YXRlLmVmZmVjdHMucHVzaChlZmZlY3QpO1xuICAgIGdhbWVTdGF0ZS5lZmZlY3RFdmVudHMucHVzaCh7XG4gICAgICAgIHR5cGU6IFwic3Bhd25cIixcbiAgICAgICAgdGltZTogZ2FtZVN0YXRlLmdhbWVUaW1lLFxuICAgICAgICBlZmZlY3Q6IGVmZmVjdFxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRQbGF5ZXIoZ2FtZVN0YXRlLCB7Y2xpZW50SWQsIGlkPWdldE5leHRJZChcInBsYXllclwiKX0pIHtcbiAgICBnYW1lU3RhdGUucGxheWVycy5wdXNoKHtcbiAgICAgICAgaWQsXG4gICAgICAgIGNsaWVudElkLFxuICAgICAgICBhbGl2ZTogdHJ1ZSxcbiAgICAgICAgc3RlZXJpbmc6IGNvbnN0YW50cy5TVEVFUklOR19TVFJBSUdIVCxcbiAgICAgICAgZ2FtZVRpbWVXaGVuU3RlZXJpbmdDaGFuZ2VkOiAwXG4gICAgfSk7XG4gICAgZ2FtZVN0YXRlLnBsYXllclN0ZWVyaW5nU2VnbWVudHNbaWRdID0gW107XG59XG5cbmZ1bmN0aW9uIGFkZFBsYXllclN0ZWVyaW5nU2VnbWVudChnYW1lU3RhdGUsIHBsYXllcklkLCBzdGVlcmluZywgZHVyYXRpb24pIHtcbiAgICB2YXIgc3RlZXJpbmdTZWdtZW50cyA9IGdhbWVTdGF0ZS5wbGF5ZXJTdGVlcmluZ1NlZ21lbnRzW3BsYXllcklkXTtcbiAgICBpZiAoc3RlZXJpbmdTZWdtZW50cy5sZW5ndGggPiAwICYmIHN0ZWVyaW5nU2VnbWVudHNbc3RlZXJpbmdTZWdtZW50cy5sZW5ndGggLSAxXS5zdGVlcmluZyA9PT0gc3RlZXJpbmcpIHtcbiAgICAgICAgc3RlZXJpbmdTZWdtZW50c1tzdGVlcmluZ1NlZ21lbnRzLmxlbmd0aCAtIDFdLmR1cmF0aW9uICs9IGR1cmF0aW9uO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHN0ZWVyaW5nU2VnbWVudHMucHVzaCh7XG4gICAgICAgICAgICBzdGVlcmluZzogc3RlZXJpbmcsXG4gICAgICAgICAgICBzdGFydFRpbWU6IGdhbWVTdGF0ZS5nYW1lVGltZSAtIGR1cmF0aW9uLFxuICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uXG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gYWRkUG93ZXJVcChnYW1lU3RhdGUsIHBvd2VyVXApIHtcbiAgICBwb3dlclVwLmlkID0gZ2V0TmV4dElkKGdhbWVTdGF0ZSwgXCJwb3dlci11cFwiKTtcbiAgICBnYW1lU3RhdGUucG93ZXJVcHMucHVzaChwb3dlclVwKTtcbiAgICBnYW1lU3RhdGUucG93ZXJVcEV2ZW50cy5wdXNoKHtcbiAgICAgICAgdHlwZTogXCJzcGF3blwiLFxuICAgICAgICB0aW1lOiBnYW1lU3RhdGUuZ2FtZVRpbWUsXG4gICAgICAgIHBvd2VyVXA6IHBvd2VyVXBcbiAgICB9KVxufVxuXG5mdW5jdGlvbiBhZGRXb3JtKGdhbWVTdGF0ZSwge2lkPWdldE5leHRJZChnYW1lU3RhdGUsIFwid29ybVwiKSwgcGxheWVySWQsIGRpcmVjdGlvbj0wLCBjZW50ZXJYLCBjZW50ZXJZLCByYWRpdXM9Y29uc3RhbnRzLldPUk1fUkFESVVTLCBzcGVlZD1jb25zdGFudHMuV09STV9TUEVFRCwgdHVybmluZ1NwZWVkPWNvbnN0YW50cy5XT1JNX1RVUk5JTkdfU1BFRUQsIGRpc3RhbmNlVHJhdmVsbGVkPTAsIGRpc3RhbmNlVHJhdmVsbGVkRnJvbUNlbGxzPXt9fSkge1xuICAgIHZhciB3b3JtID0ge1xuICAgICAgICBpZCxcbiAgICAgICAgcGxheWVySWQsXG4gICAgICAgIGNlbnRlclgsXG4gICAgICAgIGNlbnRlclksXG4gICAgICAgIHJhZGl1cyxcbiAgICAgICAgZGlyZWN0aW9uLFxuICAgICAgICBzcGVlZCxcbiAgICAgICAgdHVybmluZ1NwZWVkLFxuICAgICAgICBhbGl2ZTogdHJ1ZSxcbiAgICAgICAganVtcDoge1xuICAgICAgICAgICAgcmVtYWluaW5nSnVtcFRpbWU6IDAsXG4gICAgICAgICAgICB0aW1lU2luY2VMYXN0SnVtcDogMFxuICAgICAgICB9LFxuICAgICAgICBkaXN0YW5jZVRyYXZlbGxlZCxcbiAgICAgICAgZGlzdGFuY2VUcmF2ZWxsZWRGcm9tQ2VsbHNcbiAgICB9O1xuICAgIGdhbWVTdGF0ZS53b3Jtcy5wdXNoKHdvcm0pO1xuICAgIHJldHVybiB3b3JtO1xufVxuXG5mdW5jdGlvbiBhZGRXb3JtUGF0aFNlZ21lbnQoZ2FtZVN0YXRlLCBpZCwgc2VnbWVudCwgZm9yY2VOZXdTZWdtZW50ID0gZmFsc2UpIHtcbiAgICB2YXIgc2VnbWVudHMgPSBnYW1lU3RhdGUud29ybVBhdGhTZWdtZW50c1tpZF07XG4gICAgaWYgKCFzZWdtZW50cykge1xuICAgICAgICBzZWdtZW50cyA9IGdhbWVTdGF0ZS53b3JtUGF0aFNlZ21lbnRzW2lkXSA9IFtdO1xuICAgIH1cbiAgICBpZiAoc2VnbWVudC5pbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIFRoaXMgc2VnbWVudCBoYXMgYmVlbiBhZGRlZCB0byB0aGUgZ2FtZVN0YXRlIGFscmVhZHkuIFByb2JhYmx5IHNlbnQgZnJvbSBzZXJ2ZXIgdG8gY2xpZW50IC8vVE9ETzogVmlsbCB2aSB2ZXJrbGlnZW4gaGEgc8OlbnQgaMOkcj8gS2Fuc2tlIGthbiBmw6UgYm9ydCBkZXR0YSBmcsOlbiBjb3JlIG9jaCBmw7Zyc8O2a2EgbWluaW1lcmEgc2VydmVyLXJlbGF0ZXJhZGUgc2FrZXIuXG4gICAgICAgIHNlZ21lbnRzW3NlZ21lbnQuaW5kZXhdID0gc2VnbWVudDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoc2VnbWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBzZWdtZW50LmluZGV4ID0gMDtcbiAgICAgICAgICAgIHNlZ21lbnRzLnB1c2goc2VnbWVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgbGFzdFNlZ21lbnQgPSBzZWdtZW50c1tzZWdtZW50cy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIGlmICghZm9yY2VOZXdTZWdtZW50ICYmXG4gICAgICAgICAgICAgICAgc2VnbWVudC50eXBlID09PSBsYXN0U2VnbWVudC50eXBlICYmXG4gICAgICAgICAgICAgICAgc2VnbWVudC5zcGVlZCA9PT0gbGFzdFNlZ21lbnQuc3BlZWQgJiZcbiAgICAgICAgICAgICAgICBzZWdtZW50LnR1cm5pbmdWZWxvY2l0eSA9PT0gbGFzdFNlZ21lbnQudHVybmluZ1ZlbG9jaXR5ICYmXG4gICAgICAgICAgICAgICAgc2VnbWVudC5zaXplID09PSBsYXN0U2VnbWVudC5zaXplICYmXG4gICAgICAgICAgICAgICAgc2VnbWVudC5wbGF5ZXJJZCA9PT0gbGFzdFNlZ21lbnQucGxheWVySWQgJiZcbiAgICAgICAgICAgICAgICBzZWdtZW50Lmp1bXAgPT09IGxhc3RTZWdtZW50Lmp1bXAgJiZcbiAgICAgICAgICAgICAgICBzZWdtZW50LnN0YXJ0RGlyZWN0aW9uID09PSBsYXN0U2VnbWVudC5lbmREaXJlY3Rpb24gJiZcbiAgICAgICAgICAgICAgICBzZWdtZW50LnN0YXJ0WCA9PT0gbGFzdFNlZ21lbnQuZW5kWCAmJlxuICAgICAgICAgICAgICAgIHNlZ21lbnQuc3RhcnRZID09PSBsYXN0U2VnbWVudC5lbmRZKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBDb250aW51ZSBsYXN0IHNlZ21lbnRcbiAgICAgICAgICAgICAgICBpZiAoc2VnbWVudC50eXBlICE9PSBcImNsZWFyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGFzdFNlZ21lbnQuZHVyYXRpb24gKz0gc2VnbWVudC5kdXJhdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgbGFzdFNlZ21lbnQuZW5kVGltZSArPSBzZWdtZW50LmR1cmF0aW9uO1xuICAgICAgICAgICAgICAgICAgICBsYXN0U2VnbWVudC5lbmRYID0gc2VnbWVudC5lbmRYO1xuICAgICAgICAgICAgICAgICAgICBsYXN0U2VnbWVudC5lbmRZID0gc2VnbWVudC5lbmRZO1xuICAgICAgICAgICAgICAgICAgICBsYXN0U2VnbWVudC5lbmREaXJlY3Rpb24gPSBzZWdtZW50LmVuZERpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlZ21lbnQudHlwZSA9PT0gXCJhcmNcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFNlZ21lbnQuYXJjRW5kQW5nbGUgPSBzZWdtZW50LmFyY0VuZEFuZ2xlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFNlZ21lbnQuYXJjQW5nbGVEaWZmICs9IHNlZ21lbnQuYXJjQW5nbGVEaWZmO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBTdGFydCBuZXcgc2VnbWVudFxuICAgICAgICAgICAgICAgIHNlZ21lbnQuaW5kZXggPSBzZWdtZW50cy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgc2VnbWVudHMucHVzaChzZWdtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gYWRkV29ybVBhdGhTZWdtZW50TWV0YURhdGEoZ2FtZVN0YXRlLCBpZCwgbWV0YURhdGEsIHNpbmdsZVBvaW50SW5UaW1lKSB7XG4gICAgdmFyIHNlZ21lbnQgPSBnZXRMYXRlc3RXb3JtUGF0aFNlZ21lbnQoZ2FtZVN0YXRlLCBpZCk7XG4gICAgaWYgKHNpbmdsZVBvaW50SW5UaW1lKSB7XG4gICAgICAgIHZhciBzaW5nbGVQb2ludEluVGltZVNlZ21lbnQgPSB0cmFqZWN0b3J5VXRpbC5jcmVhdGVUcmFqZWN0b3J5KHtcbiAgICAgICAgICAgIGR1cmF0aW9uOiAwLFxuICAgICAgICAgICAgc3RhcnRYOiBzZWdtZW50LmVuZFgsXG4gICAgICAgICAgICBzdGFydFk6IHNlZ21lbnQuZW5kWSxcbiAgICAgICAgICAgIHN0YXJ0RGlyZWN0aW9uOiBzZWdtZW50LmVuZERpcmVjdGlvbixcbiAgICAgICAgICAgIHNwZWVkOiBzZWdtZW50LnNwZWVkLFxuICAgICAgICAgICAgdHVybmluZ1ZlbG9jaXR5OiBzZWdtZW50LnR1cm5pbmdWZWxvY2l0eVxuICAgICAgICB9KTtcbiAgICAgICAgc2luZ2xlUG9pbnRJblRpbWVTZWdtZW50LnN0YXJ0VGltZSA9IGdhbWVTdGF0ZS5nYW1lVGltZTtcbiAgICAgICAgc2luZ2xlUG9pbnRJblRpbWVTZWdtZW50LmVuZFRpbWUgPSBnYW1lU3RhdGUuZ2FtZVRpbWU7XG4gICAgICAgIHNpbmdsZVBvaW50SW5UaW1lU2VnbWVudC5qdW1wID0gc2VnbWVudC5qdW1wO1xuICAgICAgICBzaW5nbGVQb2ludEluVGltZVNlZ21lbnQuc2l6ZSA9IHNlZ21lbnQuc2l6ZTtcbiAgICAgICAgc2luZ2xlUG9pbnRJblRpbWVTZWdtZW50LnBsYXllcklkID0gc2VnbWVudC5wbGF5ZXJJZDtcbiAgICAgICAgc2luZ2xlUG9pbnRJblRpbWVTZWdtZW50Lndvcm1JZCA9IHNlZ21lbnQud29ybUlkO1xuICAgICAgICBzaW5nbGVQb2ludEluVGltZVNlZ21lbnQubWV0YURhdGEgPSBjbG9uZShzZWdtZW50Lm1ldGFEYXRhKTtcbiAgICAgICAgdmFyIHNlZ21lbnRBZnRlciA9IGNsb25lKHNpbmdsZVBvaW50SW5UaW1lU2VnbWVudCk7XG4gICAgICAgIHNpbmdsZVBvaW50SW5UaW1lU2VnbWVudC5tZXRhRGF0YS5wdXNoKG1ldGFEYXRhKTtcbiAgICAgICAgYWRkV29ybVBhdGhTZWdtZW50KGdhbWVTdGF0ZSwgaWQsIHNpbmdsZVBvaW50SW5UaW1lU2VnbWVudCwgdHJ1ZSk7XG4gICAgICAgIGFkZFdvcm1QYXRoU2VnbWVudChnYW1lU3RhdGUsIGlkLCBzZWdtZW50QWZ0ZXIsIHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHNlZ21lbnQubWV0YURhdGEucHVzaChtZXRhRGF0YSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVNYXAoeyBuYW1lLCBzaGFwZSwgYm9yZGVyV2lkdGg9MCwgYmxvY2tpbmdTaGFwZXM9W10gfSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIG5hbWUsXG4gICAgICAgIHNoYXBlLFxuICAgICAgICBib3JkZXJXaWR0aCxcbiAgICAgICAgYmxvY2tpbmdTaGFwZXMsXG4gICAgICAgIHdpZHRoOiBzaGFwZS5ib3VuZGluZ0JveC53aWR0aCArIDIgKiBib3JkZXJXaWR0aCxcbiAgICAgICAgaGVpZ2h0OiBzaGFwZS5ib3VuZGluZ0JveC5oZWlnaHQgKyAyICogYm9yZGVyV2lkdGhcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU1hcENpcmNsZSh7IHJhZGl1cywgbmFtZT1cIkNpcmNsZSBcIiArIHJhZGl1cywgYm9yZGVyV2lkdGg9MTAsIGJsb2NraW5nU2hhcGVzPVtdIH0pIHtcbiAgICByZXR1cm4gY3JlYXRlTWFwKHtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgc2hhcGU6IHNoYXBlRmFjdG9yeS5jcmVhdGVDaXJjbGUocmFkaXVzLCBib3JkZXJXaWR0aCwgYm9yZGVyV2lkdGgpLFxuICAgICAgICBib3JkZXJXaWR0aCxcbiAgICAgICAgYmxvY2tpbmdTaGFwZXNcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTWFwUmVjdGFuZ2xlKHsgd2lkdGgsIGhlaWdodCwgbmFtZT1cIlJlY3RhbmdsZSBcIiArIHdpZHRoICsgXCIgXCIgKyBoZWlnaHQsIGJvcmRlcldpZHRoPTEwLCBibG9ja2luZ1NoYXBlcz1bXSB9KSB7XG4gICAgcmV0dXJuIGNyZWF0ZU1hcCh7XG4gICAgICAgIG5hbWUsXG4gICAgICAgIHNoYXBlOiBzaGFwZUZhY3RvcnkuY3JlYXRlUmVjdGFuZ2xlKHdpZHRoLCBoZWlnaHQsIGJvcmRlcldpZHRoLCBib3JkZXJXaWR0aCksXG4gICAgICAgIGJvcmRlcldpZHRoLFxuICAgICAgICBibG9ja2luZ1NoYXBlc1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVNYXBTcXVhcmUoeyBzaXplLCBuYW1lPVwiU3F1YXJlIFwiICsgc2l6ZSwgYm9yZGVyV2lkdGg9MTAsIGJsb2NraW5nU2hhcGVzPVtdIH0pIHtcbiAgICByZXR1cm4gY3JlYXRlTWFwUmVjdGFuZ2xlKHtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgd2lkdGg6IHNpemUsXG4gICAgICAgIGhlaWdodDogc2l6ZSxcbiAgICAgICAgYm9yZGVyV2lkdGgsXG4gICAgICAgIGJsb2NraW5nU2hhcGVzXG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGZvckVhY2hBbGl2ZVBsYXllcihnYW1lU3RhdGUsIGNhbGxiYWNrKSB7XG4gICAgZ2FtZVN0YXRlLnBsYXllcnMuZm9yRWFjaChmdW5jdGlvbiAocGxheWVyKSB7XG4gICAgICAgIGlmIChwbGF5ZXIuYWxpdmUpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKHBsYXllcik7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gZm9yRWFjaEFsaXZlV29ybShnYW1lU3RhdGUsIGNhbGxiYWNrLCBwbGF5ZXJJZCkge1xuICAgIGdhbWVTdGF0ZS53b3Jtcy5mb3JFYWNoKGZ1bmN0aW9uICh3b3JtKSB7XG4gICAgICAgIGlmICh3b3JtLmFsaXZlICYmIChwbGF5ZXJJZCA9PT0gdW5kZWZpbmVkIHx8IHdvcm0ucGxheWVySWQgPT09IHBsYXllcklkKSkge1xuICAgICAgICAgICAgY2FsbGJhY2sod29ybSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gZm9yRWFjaEFsaXZlTGF0ZXN0V29ybVBhdGhTZWdtZW50KGdhbWVTdGF0ZSwgY2FsbGJhY2ssIHBsYXllcklkKSB7XG4gICAgdmFyIGxhdGVzdFNlZ21lbnRzID0gW107XG4gICAgZm9yRWFjaChnYW1lU3RhdGUud29ybVBhdGhTZWdtZW50cywgZnVuY3Rpb24gKHNlZ21lbnRzKSB7XG4gICAgICAgIGlmIChzZWdtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsYXRlc3RTZWdtZW50cy5wdXNoKHNlZ21lbnRzW3NlZ21lbnRzLmxlbmd0aCAtIDFdKTtcbiAgICB9KTtcbiAgICBsYXRlc3RTZWdtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChsYXRlc3RTZWdtZW50KSB7XG4gICAgICAgIGlmIChsYXRlc3RTZWdtZW50LmVuZFRpbWUgIT09IGdhbWVTdGF0ZS5nYW1lVGltZSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGdldFdvcm0oZ2FtZVN0YXRlLCBsYXRlc3RTZWdtZW50Lndvcm1JZCkuYWxpdmUgJiYgKHBsYXllcklkID09PSB1bmRlZmluZWQgfHwgbGF0ZXN0U2VnbWVudC5wbGF5ZXJJZCA9PT0gcGxheWVySWQpKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhsYXRlc3RTZWdtZW50KTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRBbGl2ZVBsYXllcnMoZ2FtZVN0YXRlKSB7XG4gICAgcmV0dXJuIGdhbWVTdGF0ZS5wbGF5ZXJzLmZpbHRlcihwID0+IHAuYWxpdmUpO1xufVxuXG5mdW5jdGlvbiBnZXRBbGl2ZVdvcm1zKGdhbWVTdGF0ZSwgcGxheWVySWQpIHtcbiAgICByZXR1cm4gZ2FtZVN0YXRlLndvcm1zLmZpbHRlcih3ID0+IHcuYWxpdmUgJiYgKHBsYXllcklkID09PSB1bmRlZmluZWQgfHwgdy5wbGF5ZXJJZCA9PT0gcGxheWVySWQpKTtcbn1cblxuZnVuY3Rpb24gZ2V0TGF0ZXN0V29ybVBhdGhTZWdtZW50KGdhbWVTdGF0ZSwgc2VnbWVudElkKSB7XG4gICAgcmV0dXJuIGdhbWVTdGF0ZS53b3JtUGF0aFNlZ21lbnRzW3NlZ21lbnRJZF1bZ2FtZVN0YXRlLndvcm1QYXRoU2VnbWVudHNbc2VnbWVudElkXS5sZW5ndGggLSAxXTtcbn1cblxuZnVuY3Rpb24gZ2V0RWZmZWN0KGdhbWVTdGF0ZSwgZWZmZWN0SWQpIHtcbiAgICByZXR1cm4gZ2FtZVN0YXRlLmVmZmVjdHMuZmluZChlID0+IGUuaWQgPT09IGVmZmVjdElkKTtcbn1cblxuZnVuY3Rpb24gZ2V0QWxpdmVFbmVteVdvcm1zKGdhbWVzU3RhdGUsIHdvcm1JZCkge1xuICAgIHJldHVybiBnZXRBbGl2ZVdvcm1zKGdhbWVzU3RhdGUpLmZpbHRlcih3ID0+IHcucGxheWVySWQgIT09IGdldFdvcm0oZ2FtZXNTdGF0ZSwgd29ybUlkKS5wbGF5ZXJJZCk7XG59XG5cbmZ1bmN0aW9uIGdldFBsYXllcihnYW1lU3RhdGUsIGlkKSB7XG4gICAgaWYgKGlkID09PSBudWxsIHx8IGlkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSWQgbXVzdCBiZSBzZXRcIik7XG4gICAgfVxuICAgIHZhciBwbGF5ZXIgPSBnYW1lU3RhdGUucGxheWVycy5maW5kKHAgPT4gcC5pZCA9PT0gaWQpO1xuICAgIGlmIChwbGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuIHBsYXllcjtcbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgd29ybSA9IGdldFdvcm0oZ2FtZVN0YXRlLCBpZCk7XG4gICAgICAgIGlmICh3b3JtKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0UGxheWVyKGdhbWVTdGF0ZSwgd29ybS5wbGF5ZXJJZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0UGxheWVyKGdhbWVTdGF0ZSwgZ2V0TGF0ZXN0V29ybVBhdGhTZWdtZW50KGdhbWVTdGF0ZSwgaWQpLnBsYXllcklkKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0UG93ZXJVcChnYW1lU3RhdGUsIHBvd2VyVXBJZCkge1xuICAgIHJldHVybiBnYW1lU3RhdGUucG93ZXJVcHMuZmluZChwID0+IHAuaWQgPT09IHBvd2VyVXBJZCk7XG59XG5cbmZ1bmN0aW9uIGdldFdvcm0oZ2FtZVN0YXRlLCB3b3JtSWQpIHtcbiAgICByZXR1cm4gZ2FtZVN0YXRlLndvcm1zLmZpbmQodyA9PiB3LmlkID09PSB3b3JtSWQpO1xufVxuXG5mdW5jdGlvbiBnZXRXb3JtRWZmZWN0cyhnYW1lU3RhdGUsIHdvcm1JZCwgZWZmZWN0VHlwZSkge1xuICAgIHZhciBlZmZlY3RzID0gZ2FtZVN0YXRlLmVmZmVjdHMuZmlsdGVyKGZ1bmN0aW9uIChlZmZlY3QpIHtcbiAgICAgICAgcmV0dXJuIGVmZmVjdC53b3JtSWQgPT09IHdvcm1JZDtcbiAgICB9KTtcbiAgICBpZiAoZWZmZWN0VHlwZSkge1xuICAgICAgICByZXR1cm4gZWZmZWN0cy5maWx0ZXIoZSA9PiBlLnR5cGUgPT09IGVmZmVjdFR5cGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBlZmZlY3RzO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0V29ybUVmZmVjdChnYW1lU3RhdGUsIHdvcm1JZCwgZWZmZWN0VHlwZSkge1xuICAgIHZhciBlZmZlY3RzID0gZ2V0V29ybUVmZmVjdHMoZ2FtZVN0YXRlLCB3b3JtSWQsIGVmZmVjdFR5cGUpO1xuICAgIHJldHVybiBlZmZlY3RzLmxlbmd0aCAhPT0gMCA/IGVmZmVjdHNbMF0gOiBudWxsO1xufVxuXG5mdW5jdGlvbiBoYXNXb3JtRWZmZWN0KGdhbWVTdGF0ZSwgd29ybUlkLCBlZmZlY3RUeXBlKSB7XG4gICAgcmV0dXJuIGdldFdvcm1FZmZlY3RzKGdhbWVTdGF0ZSwgd29ybUlkLCBlZmZlY3RUeXBlKS5sZW5ndGggPiAwO1xufVxuXG5mdW5jdGlvbiBpc1BsYXllckFsaXZlKGdhbWVTdGF0ZSwgcGxheWVySWQpIHtcbiAgICByZXR1cm4gISFnZXRBbGl2ZVBsYXllcnMoZ2FtZVN0YXRlKS5maW5kKHAgPT4gcC5pZCA9PT0gcGxheWVySWQpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVFZmZlY3QoZ2FtZVN0YXRlLCBlZmZlY3RJZCkge1xuICAgIGdhbWVTdGF0ZS5lZmZlY3RFdmVudHMucHVzaCh7XG4gICAgICAgIHR5cGU6IFwiZGVzcGF3blwiLFxuICAgICAgICB0aW1lOiBnYW1lU3RhdGUuZ2FtZVRpbWUsXG4gICAgICAgIGlkOiBlZmZlY3RJZFxuICAgIH0pO1xuICAgIGdhbWVTdGF0ZS5lZmZlY3RzLnNwbGljZShnYW1lU3RhdGUuZWZmZWN0cy5maW5kSW5kZXgoZWZmZWN0ID0+IGVmZmVjdC5pZCA9PT0gZWZmZWN0SWQpLCAxKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlUG93ZXJVcChnYW1lU3RhdGUsIHBvd2VyVXBJZCkge1xuICAgIGdhbWVTdGF0ZS5wb3dlclVwRXZlbnRzLnB1c2goe1xuICAgICAgICB0eXBlOiBcImRlc3Bhd25cIixcbiAgICAgICAgdGltZTogZ2FtZVN0YXRlLmdhbWVUaW1lLFxuICAgICAgICBpZDogcG93ZXJVcElkXG4gICAgfSk7XG4gICAgZ2FtZVN0YXRlLnBvd2VyVXBzLnNwbGljZShnYW1lU3RhdGUucG93ZXJVcHMuZmluZEluZGV4KHBvd2VyVXAgPT4gcG93ZXJVcC5pZCA9PT0gcG93ZXJVcElkKSwgMSk7XG59XG5cbmZ1bmN0aW9uIHJlc2V0UGxheUFyZWEoZ2FtZVN0YXRlKSB7XG4gICAgdmFyIGdyaWQgPSBnYW1lU3RhdGUucGxheUFyZWEuZ3JpZDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGdyaWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZ3JpZFtpXSA9IGNvbnN0YW50cy5QTEFZX0FSRUFfRlJFRTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNldFBsYXllclN0ZWVyaW5nKGdhbWVTdGF0ZSwgcGxheWVySWQsIHN0ZWVyaW5nKSB7XG4gICAgdmFyIHBsYXllciA9IGdldFBsYXllcihnYW1lU3RhdGUsIHBsYXllcklkKTtcbiAgICBpZiAocGxheWVyLnN0ZWVyaW5nICE9PSBzdGVlcmluZykge1xuICAgICAgICBwbGF5ZXIuZ2FtZVRpbWVXaGVuU3RlZXJpbmdDaGFuZ2VkID0gZ2FtZVN0YXRlLmdhbWVUaW1lO1xuICAgICAgICBwbGF5ZXIuc3RlZXJpbmcgPSBzdGVlcmluZztcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGV4dHJhY3RSZXBsYXlHYW1lU3RhdGUoZ2FtZVN0YXRlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgd29ybXM6IGdhbWVTdGF0ZS53b3Jtcy5tYXAod29ybSA9PiAoe2lkOiB3b3JtLmlkfSkpLFxuICAgICAgICBwbGF5ZXJzOiBnYW1lU3RhdGUucGxheWVycy5tYXAocGxheWVyID0+ICh7aWQ6IHBsYXllci5pZH0pKSxcbiAgICAgICAgd29ybVBhdGhTZWdtZW50czogZ2FtZVN0YXRlLndvcm1QYXRoU2VnbWVudHMsXG4gICAgICAgIGdhbWVFdmVudHM6IGdhbWVTdGF0ZS5nYW1lRXZlbnRzLFxuICAgICAgICBwb3dlclVwRXZlbnRzOiBnYW1lU3RhdGUucG93ZXJVcEV2ZW50cyxcbiAgICAgICAgZWZmZWN0RXZlbnRzOiBnYW1lU3RhdGUuZWZmZWN0RXZlbnRzLFxuICAgICAgICBnYW1lVGltZTogZ2FtZVN0YXRlLmdhbWVUaW1lLFxuICAgICAgICBtYXA6IGdhbWVTdGF0ZS5tYXBcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBnZXROZXh0SWQoZ2FtZVN0YXRlLCBwcmVmaXggPSBcIlwiKSB7XG4gICAgdmFyIG5leHRJZCA9IHByZWZpeCArIFwiX1wiICsgZ2FtZVN0YXRlLm5leHRJZDtcbiAgICBnYW1lU3RhdGUubmV4dElkICs9IDE7XG4gICAgcmV0dXJuIG5leHRJZDtcbn1cblxuZnVuY3Rpb24gYWRkUGxheUFyZWFTaGFwZShnYW1lU3RhdGUsIHNoYXBlLCB2YWx1ZSkge1xuICAgIHZhciBwbGF5QXJlYSA9IGdhbWVTdGF0ZS5wbGF5QXJlYTtcbiAgICB2YXIgcG9pbnRzID0gc2hhcGVUb0dyaWRDb252ZXJ0ZXIuY29udmVydChzaGFwZSwgcGxheUFyZWEpO1xuICAgIHZhciBjaGFuZ2VkRGF0YSA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vIEJ1ZmZlciBzaG91bGQgb25seSBiZSB1cGRhdGVkIHdoZW4gYSB2YWx1ZSBoYXMgY2hhbmdlZFxuICAgICAgICAvLyBUT0RPIEFUTSB3ZSBkbyBub3QgYWNjZXB0IFwicGFpbnRpbmcgb3ZlclwiLiBJZiB3ZSB3ZXJlLCB3b3JtIHdvcm0gY29sbGlzaW9uIHdvdWxkIGhhdmUgaXNzdWVzIHNpbmNlIHdlIHdvdWxkIG5vdCBjb2xsaWRlIGFnYWluc3Qgb3RoZXIgd29ybXMsIG1pZ2h0IHdhbnQgdG8gZml4IHRoaXNcbiAgICAgICAgaWYgKHBsYXlBcmVhLmdyaWRbcG9pbnRzW2ldXSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgIHBsYXlBcmVhLmdyaWRbcG9pbnRzW2ldXSA9IHZhbHVlO1xuICAgICAgICAgICAgY2hhbmdlZERhdGEucHVzaCh7XG4gICAgICAgICAgICAgICAgaW5kZXg6IHBvaW50c1tpXSxcbiAgICAgICAgICAgICAgICB2YWx1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNoYW5nZWREYXRhO1xufVxuXG5mdW5jdGlvbiBhZGRQbGF5QXJlYU9ic3RhY2xlKGdhbWVTdGF0ZSwgc2hhcGUpIHtcbiAgICByZXR1cm4gYWRkUGxheUFyZWFTaGFwZShnYW1lU3RhdGUsIHNoYXBlLCBjb25zdGFudHMuUExBWV9BUkVBX09CU1RBQ0xFKTtcbn1cblxuZnVuY3Rpb24gaXNJblN0YXJ0UGhhc2UoZ2FtZVN0YXRlKSB7XG4gICAgcmV0dXJuIGdhbWVTdGF0ZS5nYW1lQWN0aXZlICYmIGdhbWVTdGF0ZS5zdGFydFBoYXNlVGltZXIgPiAwO1xufVxuXG5mdW5jdGlvbiBpc0luUGxheVBoYXNlKGdhbWVTdGF0ZSkge1xuICAgIHJldHVybiBnYW1lU3RhdGUuZ2FtZUFjdGl2ZSAmJiAhaXNJblN0YXJ0UGhhc2UoZ2FtZVN0YXRlKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlR2FtZVN0YXRlKHtcbiAgICBtYXAsXG4gICAgc2VlZCxcbiAgICBwbGF5ZXJzID0gW10sXG4gICAgd29ybXMgPSBbXSxcbiAgICBwb3dlclVwcyA9IFtdLFxuICAgIGVmZmVjdHMgPSBbXSxcbiAgICBwbGF5ZXJTdGVlcmluZ1NlZ21lbnRzID0ge30sXG4gICAgd29ybVBhdGhTZWdtZW50cyA9IHt9LFxuICAgIGdhbWVFdmVudHMgPSBbXSxcbiAgICBwb3dlclVwRXZlbnRzID0gW10sXG4gICAgZWZmZWN0RXZlbnRzID0gW10sXG4gICAgZ2FtZVRpbWUgPSAwLFxuICAgIGdhbWVBY3RpdmUgPSBmYWxzZSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVE9ETzogbWlnaHQgZ2V0IHJlbW92ZWRcbiAgICBzdGFydFBoYXNlVGltZXIgPSBjb25zdGFudHMuU1RBUlRfUEhBU0VfRFVSQVRJT04sXG4gICAgbmV4dElkID0gMFxuICAgIH0gPSB7fSkge1xuICAgIGZ1bmN0aW9uIGNyZWF0ZVBsYXlBcmVhKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgdmFyIHBsYXlBcmVhID0ge1xuICAgICAgICAgICAgcm93czogaGVpZ2h0LFxuICAgICAgICAgICAgY29sczogd2lkdGgsXG4gICAgICAgICAgICBncmlkOiBuZXcgQXJyYXkoaGVpZ2h0ICogd2lkdGgpXG4gICAgICAgIH07XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGxheUFyZWEuZ3JpZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcGxheUFyZWEuZ3JpZFtpXSA9IGNvbnN0YW50cy5QTEFZX0FSRUFfRlJFRTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGxheUFyZWE7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNyZWF0ZVNpbXBsZUdhbWVTdGF0ZSh7XG4gICAgICAgIHBsYXllcnMsXG4gICAgICAgIC8vICBbe1xuICAgICAgICAvLyAgICAgIGlkLFxuICAgICAgICAvLyAgICAgIHN0ZWVyaW5nLFxuICAgICAgICAvLyAgICAgIGdhbWVUaW1lV2hlblN0ZWVyaW5nQ2hhbmdlZCxcbiAgICAgICAgLy8gICAgICBhbGl2ZVxuICAgICAgICAvLyAgfV1cbiAgICAgICAgd29ybXMsXG4gICAgICAgIC8vICBbe1xuICAgICAgICAvLyAgICAgIGlkLFxuICAgICAgICAvLyAgICAgIHBsYXllcklkLFxuICAgICAgICAvLyAgICAgIGNlbnRlclgsXG4gICAgICAgIC8vICAgICAgY2VudGVyWSxcbiAgICAgICAgLy8gICAgICByYWRpdXMsXG4gICAgICAgIC8vICAgICAgZGlyZWN0aW9uLFxuICAgICAgICAvLyAgICAgIHNwZWVkLFxuICAgICAgICAvLyAgICAgIHR1cm5pbmdTcGVlZCxcbiAgICAgICAgLy8gICAgICBhbGl2ZSxcbiAgICAgICAgLy8gICAgICBqdW1wOiB7XG4gICAgICAgIC8vICAgICAgICAgIHJlbWFpbmluZ0p1bXBUaW1lOiAwLFxuICAgICAgICAvLyAgICAgICAgICB0aW1lU2luY2VMYXN0SnVtcDogMFxuICAgICAgICAvLyAgICAgIH0sXG4gICAgICAgIC8vICAgICAgaW1tdW5pdHlEYXRhOiB1bmRlZmluZWRcbiAgICAgICAgLy8gICAgICB9XVxuXG4gICAgICAgIHBvd2VyVXBzLFxuICAgICAgICAvLyAgW3tcbiAgICAgICAgLy8gICAgICBpZCxcbiAgICAgICAgLy8gICAgICBuYW1lLFxuICAgICAgICAvLyAgICAgIHNoYXBlLFxuICAgICAgICAvLyAgICAgIGVmZmVjdFR5cGUsXG4gICAgICAgIC8vICAgICAgZWZmZWN0U3RyZW5ndGgsIC8vIEhpZ2hlciBtZWFucyBtb3JlIHBvdGVudCwgbmVnYXRpdmUgY291bGQgbWVhbiByZXZlcnNlZC4gRm9yIHNwZWVkIGVmZmVjdCwgLTEgbWVhbnMgZGVjcmVhc2VkIHNwZWVkIGZvciBleGFtcGxlXG4gICAgICAgIC8vICAgICAgZWZmZWN0RHVyYXRpb24sIC8vIFRoZSBkdXJhdGlvbiBmb3IgdGhlIGVmZmVjdCwgaWYgaXQgaGFzIG9uZVxuICAgICAgICAvLyAgICAgIGFmZmVjdHMgICAgICAgICAvLyBhbGwgfCBvdGhlcnMgfCBzZWxmXG4gICAgICAgIC8vICB9XVxuXG4gICAgICAgIGVmZmVjdHMsXG4gICAgICAgIC8vICBbe1xuICAgICAgICAvLyAgICAgIHR5cGUsXG4gICAgICAgIC8vICAgICAgcmVtYWluaW5nRHVyYXRpb24sXG4gICAgICAgIC8vICAgICAgd29ybUlkLFxuICAgICAgICAvLyAgICAgIHN0cmVuZ3RoICAgICAgICAgICAgLy8gQ29tZXMgZnJvbSB0aGUgcG93ZXItdXBzIGVmZmVjdFN0cmVuZ3RoXG4gICAgICAgIC8vICB9XVxuICAgICAgICBwbGF5ZXJTdGVlcmluZ1NlZ21lbnRzLFxuICAgICAgICAvLyAge1tcbiAgICAgICAgLy8gICAgICBzdGVlcmluZyxcbiAgICAgICAgLy8gICAgICBzdGFydFRpbWUsXG4gICAgICAgIC8vICAgICAgZHVyYXRpb25cbiAgICAgICAgLy8gIF19XG4gICAgICAgIHdvcm1QYXRoU2VnbWVudHMsXG4gICAgICAgIC8vICB7W1xuICAgICAgICAvLyAgICAgIHR5cGUsICAgICAgICAgICAvLyBzdHJhaWdodCB8IGFyYyB8IHN0aWxsX2FyY1xuICAgICAgICAvLyAgICAgIGluZGV4LCAgICAgICAgICAvLyB0aGUgcG9zaXRpb24gb2YgdGhlIHNlZ21lbnQgaW4gdGhlIGxpc3RcbiAgICAgICAgLy8gICAgICBkdXJhdGlvbixcbiAgICAgICAgLy8gICAgICBzdGFydFRpbWUsXG4gICAgICAgIC8vICAgICAgZW5kVGltZSxcbiAgICAgICAgLy8gICAgICBqdW1wLCAgICAgICAgICAgLy8gdHJ1ZSB8IGZhbHNlXG4gICAgICAgIC8vICAgICAgc2l6ZSxcbiAgICAgICAgLy8gICAgICBwbGF5ZXJJZCxcbiAgICAgICAgLy8gICAgICBzdGFydFgsXG4gICAgICAgIC8vICAgICAgc3RhcnRZLFxuICAgICAgICAvLyAgICAgIHN0YXJ0RGlyZWN0aW9uLFxuICAgICAgICAvLyAgICAgIHNwZWVkLFxuICAgICAgICAvLyAgICAgIHR1cm5pbmdWZWxvY2l0eVxuICAgICAgICAvLyAgICAgIGVuZFgsXG4gICAgICAgIC8vICAgICAgZW5kWSxcbiAgICAgICAgLy8gICAgICBlbmREaXJlY3Rpb25cbiAgICAgICAgLy8gIF19XG4gICAgICAgIGdhbWVFdmVudHMsXG4gICAgICAgIC8vICBbe1xuICAgICAgICAvLyAgICAgIHR5cGUsICAgICAgICAgICAvLyBnYW1lX3N0YXJ0IHwgcGxheWVyX2RpZWQgfCBnYW1lX292ZXJcbiAgICAgICAgLy8gICAgICB0aW1lXG4gICAgICAgIC8vICAgICAgKGlkKSAgICAgICAgICAgIC8vIE9ubHkgZm9yIHR5cGUgcGxheWVyX2RpZWRcbiAgICAgICAgLy8gIH1dLFxuICAgICAgICBwb3dlclVwRXZlbnRzLFxuICAgICAgICAvLyAgW3tcbiAgICAgICAgLy8gICAgICB0eXBlLCAgICAgICAgICAgLy8gc3Bhd24gfCBkZXNwYXduXG4gICAgICAgIC8vICAgICAgdGltZSxcbiAgICAgICAgLy8gICAgICAocG93ZXJVcCksICAgICAgLy8gT25seSBmb3IgdHlwZSBzcGF3blxuICAgICAgICAvLyAgICAgIChpZCkgICAgICAgICAgICAvLyBPbmx5IGZvciB0eXBlIGRlc3Bhd25cbiAgICAgICAgLy8gIH1dLFxuICAgICAgICBlZmZlY3RFdmVudHMsXG4gICAgICAgIC8vICBbe1xuICAgICAgICAvLyAgICAgIHR5cGUsXG4gICAgICAgIC8vICAgICAgdGltZVxuICAgICAgICAvLyAgICAgIChlZmZlY3QpICAgICAgICAvLyBPbmx5IGZvciB0eXBlIHNwYXduXG4gICAgICAgIC8vICAgICAgKGlkKSAgICAgICAgICAgIC8vIE9ubHkgZm9yIHR5cGUgZGVzcGF3blxuICAgICAgICAvLyAgfV0sXG4gICAgICAgIG1hcCxcbiAgICAgICAgcGxheUFyZWE6IG1hcCA/IGNyZWF0ZVBsYXlBcmVhKG1hcC53aWR0aCwgbWFwLmhlaWdodCkgOiBudWxsLFxuICAgICAgICBnYW1lVGltZSxcbiAgICAgICAgZ2FtZUFjdGl2ZSwgLy8gVE9ETzogbWlnaHQgZ2V0IHJlbW92ZWRcbiAgICAgICAgc3RhcnRQaGFzZVRpbWVyLCAvLyBUaW1lIGxlZnQgdW50aWwgc3RhcnQgcGhhc2UgZW5kc1xuICAgICAgICBzZWVkLFxuICAgICAgICBuZXh0SWRcbiAgICB9KVxufVxuXG5mdW5jdGlvbiBjcmVhdGVTaW1wbGVHYW1lU3RhdGUob3B0aW9ucykge1xuICAgIHZhciBnYW1lU3RhdGUgPSB7fTtcbiAgICBmb3JFYWNoKG9wdGlvbnMsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgIGlmICh2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBnYW1lU3RhdGVba2V5XSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGdhbWVTdGF0ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgYWRkRWZmZWN0LFxuICAgIGFkZFdvcm1QYXRoU2VnbWVudE1ldGFEYXRhLFxuICAgIGFkZFBsYXlBcmVhT2JzdGFjbGUsXG4gICAgYWRkUGxheUFyZWFTaGFwZSxcbiAgICBhZGRQbGF5ZXIsXG4gICAgYWRkUGxheWVyU3RlZXJpbmdTZWdtZW50LFxuICAgIGFkZFBvd2VyVXAsXG4gICAgYWRkV29ybSxcbiAgICBhZGRXb3JtUGF0aFNlZ21lbnQsXG4gICAgY3JlYXRlR2FtZVN0YXRlLFxuICAgIGNyZWF0ZVNpbXBsZUdhbWVTdGF0ZSxcbiAgICBjcmVhdGVNYXAsXG4gICAgY3JlYXRlTWFwQ2lyY2xlLFxuICAgIGNyZWF0ZU1hcFJlY3RhbmdsZSxcbiAgICBjcmVhdGVNYXBTcXVhcmUsXG4gICAgZXh0cmFjdFJlcGxheUdhbWVTdGF0ZSxcbiAgICBmb3JFYWNoQWxpdmVQbGF5ZXIsXG4gICAgZm9yRWFjaEFsaXZlV29ybSxcbiAgICBmb3JFYWNoQWxpdmVMYXRlc3RXb3JtUGF0aFNlZ21lbnQsXG4gICAgZ2V0QWxpdmVFbmVteVdvcm1zLFxuICAgIGdldEFsaXZlUGxheWVycyxcbiAgICBnZXRBbGl2ZVdvcm1zLFxuICAgIGdldEVmZmVjdCxcbiAgICBnZXRMYXRlc3RXb3JtUGF0aFNlZ21lbnQsXG4gICAgZ2V0TmV4dElkLFxuICAgIGdldFBvd2VyVXAsXG4gICAgZ2V0UGxheWVyLFxuICAgIGdldFdvcm0sXG4gICAgZ2V0V29ybUVmZmVjdCxcbiAgICBnZXRXb3JtRWZmZWN0cyxcbiAgICBoYXNXb3JtRWZmZWN0LFxuICAgIGlzSW5TdGFydFBoYXNlLFxuICAgIGlzSW5QbGF5UGhhc2UsXG4gICAgaXNQbGF5ZXJBbGl2ZSxcbiAgICByZW1vdmVFZmZlY3QsXG4gICAgcmVtb3ZlUG93ZXJVcCxcbiAgICByZXNldFBsYXlBcmVhLFxuICAgIHNldFBsYXllclN0ZWVyaW5nXG59OyIsIi8qKlxuICogUmVwcmVzZW50cyB0aGUgcGFyYW1ldGVycyBmb3IgYSBnZW5lcmljIHNoYXBlLlxuICogQHBhcmFtIHR5cGVcbiAqIEBwYXJhbSBib3VuZGluZ1dpZHRoXG4gKiBAcGFyYW0gYm91bmRpbmdIZWlnaHRcbiAqIEBwYXJhbSB4IElmIHVuZGVmaW5lZCB0aGVuIG5vIGNvb3JkaW5hdGUgdmFyaWFibGVzIHdpbGwgYmUgY3JlYXRlZFxuICogQHBhcmFtIHkgSWYgdW5kZWZpbmVkIHRoZW4gbm8gY29vZGluYXRlIHZhcmlhYmxlcyB3aWxsIGJlIGNyZWF0ZWRcbiAqIEByZXR1cm5zIHt7fX1cbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBjcmVhdGVTaGFwZSh0eXBlLCBib3VuZGluZ1dpZHRoLCBib3VuZGluZ0hlaWdodCwgeCwgeSwgYXJlYSkge1xuICAgIGZ1bmN0aW9uIHNldENvb3JkaW5hdGVzKHRhcmdldCwgYm91bmRpbmdCb3gsIHgsIHkpIHtcbiAgICAgICAgdGFyZ2V0LnggPSB4O1xuICAgICAgICB0YXJnZXQueSA9IHk7XG4gICAgICAgIHRhcmdldC5tYXhYID0geCArIGJvdW5kaW5nQm94LndpZHRoO1xuICAgICAgICB0YXJnZXQubWF4WSA9IHkgKyBib3VuZGluZ0JveC5oZWlnaHQ7XG4gICAgICAgIHRhcmdldC5jZW50ZXJYID0geCArIGJvdW5kaW5nQm94LndpZHRoIC8gMjtcbiAgICAgICAgdGFyZ2V0LmNlbnRlclkgPSB5ICsgYm91bmRpbmdCb3guaGVpZ2h0IC8gMjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVCb3VuZGluZ0JveCh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB3aWR0aDogd2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IGhlaWdodFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRGVmaW5lZCh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgc2hhcGUgPSB7fTtcbiAgICBzaGFwZS50eXBlID0gdHlwZTtcbiAgICBzaGFwZS5ib3VuZGluZ0JveCA9IGNyZWF0ZUJvdW5kaW5nQm94KGJvdW5kaW5nV2lkdGgsIGJvdW5kaW5nSGVpZ2h0KTtcbiAgICBzaGFwZS5hcmVhID0gYXJlYTtcblxuICAgIGlmIChpc0RlZmluZWQoeCkgJiYgaXNEZWZpbmVkKHkpKSB7XG4gICAgICAgIC8vIG9ubHkgc2V0IHRoZSBjb29yZGluYXRlIHBhcmFtZXRlcnMgaWYgeCBhbmQgeSBhcmUgcHJvdmlkZWRcbiAgICAgICAgc2V0Q29vcmRpbmF0ZXMoc2hhcGUsIHNoYXBlLmJvdW5kaW5nQm94LCB4LCB5KTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2hhcGU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNpcmNsZShyYWRpdXMsIHgsIHkpIHtcbiAgICB2YXIgYXJlYSA9IE1hdGguUEkgKiByYWRpdXMgKiByYWRpdXM7XG4gICAgdmFyIHNoYXBlID0gY3JlYXRlU2hhcGUoXCJjaXJjbGVcIiwgcmFkaXVzICogMiwgcmFkaXVzICogMiwgeCwgeSwgYXJlYSk7XG4gICAgc2hhcGUucmFkaXVzID0gcmFkaXVzO1xuICAgIHJldHVybiBzaGFwZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlUmVjdGFuZ2xlKHdpZHRoLCBoZWlnaHQsIHgsIHkpIHtcbiAgICB2YXIgYXJlYSA9IHdpZHRoICogaGVpZ2h0O1xuICAgIHZhciBzaGFwZSA9IGNyZWF0ZVNoYXBlKFwicmVjdGFuZ2xlXCIsIHdpZHRoLCBoZWlnaHQsIHgsIHksIGFyZWEpO1xuXG4gICAgc2hhcGUud2lkdGggPSB3aWR0aDtcbiAgICBzaGFwZS5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgcmV0dXJuIHNoYXBlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVTcXVhcmUoc2l6ZSwgeCwgeSkge1xuICAgIHJldHVybiBjcmVhdGVSZWN0YW5nbGUoc2l6ZSwgc2l6ZSwgeCwgeSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGNyZWF0ZUNpcmNsZSxcbiAgICBjcmVhdGVSZWN0YW5nbGUsXG4gICAgY3JlYXRlU3F1YXJlXG59O1xuIiwidmFyIHNwYXRpYWxSZWxhdGlvbnMgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5zcGF0aWFsUmVsYXRpb25zLmludGVyc2VjdHMgPSBmdW5jdGlvbiBpbnRlcnNlY3RzKHNoYXBlLCBvdGhlclNoYXBlKSB7XG4gICAgcmV0dXJuIGlzUmVsYXRpb25UcnVlKGludGVyc2VjdHNGdW5jdGlvbnMsIHNoYXBlLCBvdGhlclNoYXBlKTtcbn07XG5cbnNwYXRpYWxSZWxhdGlvbnMuY29udGFpbnMgPSBmdW5jdGlvbiBjb250YWlucyhvdXRlclNoYXBlLCBpbm5lclNoYXBlKSB7XG4gICAgcmV0dXJuIGlzUmVsYXRpb25UcnVlKGNvbnRhaW5tZW50RnVuY3Rpb25zLCBvdXRlclNoYXBlLCBpbm5lclNoYXBlKTtcbn07XG5cbnNwYXRpYWxSZWxhdGlvbnMuZGlzdGFuY2VTcXVhcmVkID0gZnVuY3Rpb24gZGlzdGFuY2Uoc2hhcGUsIG90aGVyU2hhcGUpIHtcbiAgICB2YXIgZGlzdCA9IGdldFhZRGlzdChzaGFwZSwgb3RoZXJTaGFwZSk7XG4gICAgcmV0dXJuIGRpc3QueCAqIGRpc3QueCArIGRpc3QueSAqIGRpc3QueTtcbn07XG5cbi8vIC0tIElOVEVSU0VDVElPTi1GVU5DVElPTlMgLS1cbnZhciBpbnRlcnNlY3RzRnVuY3Rpb25zID0gY3JlYXRlU2hhcGVSZWxhdGlvbk1hdHJpeCgpO1xuXG5pbnRlcnNlY3RzRnVuY3Rpb25zW1wiY2lyY2xlXCJdW1wiY2lyY2xlXCJdID0gZnVuY3Rpb24gY2lyY2xlQ2lyY2xlSW50ZXJzZWN0aW9uKGNpcmNsZSwgb3RoZXJDaXJjbGUpIHtcbiAgICBpZiAoIWJvdW5kaW5nQm94ZXNJbnRlcnNlY3RzKGNpcmNsZSwgb3RoZXJDaXJjbGUpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgbWF4QWxsb3dlZERpc3QgPSBjaXJjbGUucmFkaXVzICsgb3RoZXJDaXJjbGUucmFkaXVzO1xuXG4gICAgcmV0dXJuIHNwYXRpYWxSZWxhdGlvbnMuZGlzdGFuY2VTcXVhcmVkKGNpcmNsZSwgb3RoZXJDaXJjbGUpIDwgbWF4QWxsb3dlZERpc3QgKiBtYXhBbGxvd2VkRGlzdDtcbn07XG5cbmludGVyc2VjdHNGdW5jdGlvbnNbXCJyZWN0YW5nbGVcIl1bXCJyZWN0YW5nbGVcIl0gPSBmdW5jdGlvbiByZWN0YW5nbGVSZWN0YW5nbGVJbnRlcnNlY3Rpb24ocmVjdGFuZ2xlLCBvdGhlclJlY3RhbmdsZSkge1xuICAgIHJldHVybiBib3VuZGluZ0JveGVzSW50ZXJzZWN0cyhyZWN0YW5nbGUsIG90aGVyUmVjdGFuZ2xlKTtcbn07XG5cbmludGVyc2VjdHNGdW5jdGlvbnNbXCJjaXJjbGVcIl1bXCJyZWN0YW5nbGVcIl0gPSBmdW5jdGlvbiBjaXJjbGVSZWN0YW5nbGVJbnRlcnNlY3Rpb24oY2lyY2xlLCByZWN0YW5nbGUpIHtcbiAgICBpZiAoIWJvdW5kaW5nQm94ZXNJbnRlcnNlY3RzKGNpcmNsZSwgcmVjdGFuZ2xlKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIGRpc3QgPSBnZXRYWURpc3QoY2lyY2xlLCByZWN0YW5nbGUpO1xuXG4gICAgLy9UaGUgZm9sbG93aW5nIDIgY2hlY2tzIGFyZSBvbmx5IHZhbGlkIGJlY2F1c2Ugb2YgcHJpb3IgY2hlY2tpbmcgb2YgdGhlIGJvdW5kaW5nIGJveGVzXG4gICAgaWYgKGRpc3QueCA8PSAocmVjdGFuZ2xlLndpZHRoIC8gMikpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChkaXN0LnkgPD0gKHJlY3RhbmdsZS5oZWlnaHQgLyAyKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBzcGVjaWFsIGNhc2UgZm9yIHJlY3RhbmdsZSBjb3JuZXJzXG4gICAgdmFyIGNvcm5lckRpc3RYID0gZGlzdC54IC0gcmVjdGFuZ2xlLndpZHRoIC8gMjtcbiAgICB2YXIgY29ybmVyRGlzdFkgPSBkaXN0LnkgLSByZWN0YW5nbGUuaGVpZ2h0IC8gMjtcbiAgICB2YXIgY29ybmVyRGlzdGFuY2VTcSA9IGNvcm5lckRpc3RYKmNvcm5lckRpc3RYICsgY29ybmVyRGlzdFkqY29ybmVyRGlzdFk7XG5cbiAgICByZXR1cm4gY29ybmVyRGlzdGFuY2VTcSA8PSBjaXJjbGUucmFkaXVzICogY2lyY2xlLnJhZGl1cztcbn07XG5cbmludGVyc2VjdHNGdW5jdGlvbnNbXCJyZWN0YW5nbGVcIl1bXCJjaXJjbGVcIl0gPSBmdW5jdGlvbiByZWN0YW5nbGVDaXJjbGVJbnRlcnNlY3Rpb24ocmVjdGFuZ2xlLCBjaXJjbGUpIHtcbiAgICByZXR1cm4gaW50ZXJzZWN0c0Z1bmN0aW9uc1tcImNpcmNsZVwiXVtcInJlY3RhbmdsZVwiXShjaXJjbGUsIHJlY3RhbmdsZSk7XG59O1xuXG5cbi8vIC0tIENPTlRBSU5NRU5ULUZVTkNUSU9OU1xudmFyIGNvbnRhaW5tZW50RnVuY3Rpb25zID0gY3JlYXRlU2hhcGVSZWxhdGlvbk1hdHJpeCgpO1xuXG5jb250YWlubWVudEZ1bmN0aW9uc1tcImNpcmNsZVwiXVtcImNpcmNsZVwiXSA9IGZ1bmN0aW9uIGNpcmNsZUNpcmNsZUNvbnRhaW5tZW50KG91dGVyQ2lyY2xlLCBpbm5lckNpcmNsZSkge1xuICAgIGlmICghYm91bmRpbmdCb3hlc0NvbnRhaW5zKG91dGVyQ2lyY2xlLCBpbm5lckNpcmNsZSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBtYXhBbGxvd2VkRGlzdCA9IG91dGVyQ2lyY2xlLnJhZGl1cyAtIGlubmVyQ2lyY2xlLnJhZGl1cztcblxuICAgIHJldHVybiBzcGF0aWFsUmVsYXRpb25zLmRpc3RhbmNlU3F1YXJlZChvdXRlckNpcmNsZSwgaW5uZXJDaXJjbGUpIDwgbWF4QWxsb3dlZERpc3QgKiBtYXhBbGxvd2VkRGlzdDtcbn07XG5cbmNvbnRhaW5tZW50RnVuY3Rpb25zW1wicmVjdGFuZ2xlXCJdW1wicmVjdGFuZ2xlXCJdID0gZnVuY3Rpb24gcmVjdGFuZ2xlUmVjdGFuZ2xlQ29udGFpbm1lbnQob3V0ZXJSZWN0YW5nbGUsIGlubmVyUmVjdGFuZ2xlKSB7XG4gICAgcmV0dXJuIGJvdW5kaW5nQm94ZXNDb250YWlucyhvdXRlclJlY3RhbmdsZSwgaW5uZXJSZWN0YW5nbGUpO1xufTtcblxuY29udGFpbm1lbnRGdW5jdGlvbnNbXCJjaXJjbGVcIl1bXCJyZWN0YW5nbGVcIl0gPSBmdW5jdGlvbiBjaXJjbGVSZWN0YW5nbGVDb250YWlubWVudChvdXRlckNpcmNsZSwgaW5uZXJSZWN0YW5nbGUpIHtcbiAgICBpZiAoIWJvdW5kaW5nQm94ZXNDb250YWlucyhvdXRlckNpcmNsZSwgaW5uZXJSZWN0YW5nbGUpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvL2hlcmUgd2Ugc2VsZWN0IHRoZSByZWN0YW5nbGVzIGNvcm5lciBwb2ludCBmdXJ0aGVzdCBhd2F5IGZyb20gdGhlIGNpcmNsZSBjZW50ZXJcbiAgICB2YXIgZGlzdFggPSBNYXRoLm1heChNYXRoLmFicyhvdXRlckNpcmNsZS5jZW50ZXJYIC0gaW5uZXJSZWN0YW5nbGUueCksIE1hdGguYWJzKG91dGVyQ2lyY2xlLmNlbnRlclggLSBpbm5lclJlY3RhbmdsZS5tYXhYKSk7XG4gICAgdmFyIGRpc3RZID0gTWF0aC5tYXgoTWF0aC5hYnMob3V0ZXJDaXJjbGUuY2VudGVyWSAtIGlubmVyUmVjdGFuZ2xlLnkpLCBNYXRoLmFicyhvdXRlckNpcmNsZS5jZW50ZXJZIC0gaW5uZXJSZWN0YW5nbGUubWF4WSkpO1xuXG4gICAgcmV0dXJuIGRpc3RYKmRpc3RYICsgZGlzdFkqZGlzdFkgPD0gb3V0ZXJDaXJjbGUucmFkaXVzKm91dGVyQ2lyY2xlLnJhZGl1cztcbn07XG5cbmNvbnRhaW5tZW50RnVuY3Rpb25zW1wicmVjdGFuZ2xlXCJdW1wiY2lyY2xlXCJdID0gZnVuY3Rpb24gcmVjdGFuZ2xlQ2lyY2xlQ29udGFpbm1lbnQob3V0ZXJSZWN0YW5nbGUsIGlubmVyQ2lyY2xlKSB7XG4gICAgcmV0dXJuIGJvdW5kaW5nQm94ZXNDb250YWlucyhvdXRlclJlY3RhbmdsZSwgaW5uZXJDaXJjbGUpO1xufTtcblxuXG4vLyAtLSBVVElMSVRZLUZVTkNUSU9OUyAtLVxuZnVuY3Rpb24gaXNSZWxhdGlvblRydWUoc3BhdGlhbFJlbGF0aW9uc0Z1bmN0aW9ucywgc2hhcGUsIG90aGVyU2hhcGUpIHtcbiAgICBmdW5jdGlvbiBjb252ZXJ0V29ybVRvQ2lyY2xlKHcpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6IFwiY2lyY2xlXCIsXG4gICAgICAgICAgICBjZW50ZXJYOiB3LmNlbnRlclgsXG4gICAgICAgICAgICBjZW50ZXJZOiB3LmNlbnRlclksXG4gICAgICAgICAgICB4OiB3LmNlbnRlclggLSB3LnJhZGl1cyxcbiAgICAgICAgICAgIHk6IHcuY2VudGVyWSAtIHcucmFkaXVzLFxuICAgICAgICAgICAgbWF4WDogdy5jZW50ZXJYICsgdy5yYWRpdXMsXG4gICAgICAgICAgICBtYXhZOiB3LmNlbnRlclkgKyB3LnJhZGl1cyxcbiAgICAgICAgICAgIHJhZGl1czogdy5yYWRpdXMsXG4gICAgICAgICAgICBib3VuZGluZ0JveDoge1xuICAgICAgICAgICAgICAgIHdpZHRoOiB3LnJhZGl1cyAqIDIsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB3LnJhZGl1cyAqIDJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBUT0RPIE5vdCB0aGUgcHJldHRpZXN0IGJ1dCB3b3JrcyBmb3Igbm93LiBUaGlzIGhhbmRsZXMgc3BlY2lhbCB3b3JtIHRyZWF0bWVudFxuICAgIGlmICghc2hhcGUudHlwZSkge1xuICAgICAgICBzaGFwZSA9IGNvbnZlcnRXb3JtVG9DaXJjbGUoc2hhcGUpO1xuICAgIH1cblxuICAgIGlmKCFvdGhlclNoYXBlLnR5cGUpIHtcbiAgICAgICAgb3RoZXJTaGFwZSA9IGNvbnZlcnRXb3JtVG9DaXJjbGUob3RoZXJTaGFwZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNwYXRpYWxSZWxhdGlvbnNGdW5jdGlvbnNbc2hhcGUudHlwZV1bb3RoZXJTaGFwZS50eXBlXShzaGFwZSwgb3RoZXJTaGFwZSk7XG59XG5cbmZ1bmN0aW9uIGJvdW5kaW5nQm94ZXNJbnRlcnNlY3RzKHNoYXBlLCBvdGhlclNoYXBlKSB7XG4gICAgdmFyIGRpc3QgPSBnZXRYWURpc3Qoc2hhcGUsIG90aGVyU2hhcGUpO1xuXG4gICAgdmFyIG1pbkJvdW5kaW5nRGlzdFggPSBzaGFwZS5ib3VuZGluZ0JveC53aWR0aCAvIDIgKyBvdGhlclNoYXBlLmJvdW5kaW5nQm94LndpZHRoIC8gMjtcbiAgICB2YXIgbWluQm91bmRpbmdEaXN0WSA9IHNoYXBlLmJvdW5kaW5nQm94LmhlaWdodCAvIDIgKyBvdGhlclNoYXBlLmJvdW5kaW5nQm94LmhlaWdodCAvIDI7XG5cbiAgICByZXR1cm4gIShkaXN0LnggPiBtaW5Cb3VuZGluZ0Rpc3RYIHx8IGRpc3QueSA+IG1pbkJvdW5kaW5nRGlzdFkpO1xufVxuXG5mdW5jdGlvbiBib3VuZGluZ0JveGVzQ29udGFpbnMob3V0ZXJTaGFwZSwgaW5uZXJTaGFwZSkge1xuICAgIHZhciBkaXN0ID0gZ2V0WFlEaXN0KG91dGVyU2hhcGUsIGlubmVyU2hhcGUpO1xuXG4gICAgZGlzdC54ICs9IGlubmVyU2hhcGUuYm91bmRpbmdCb3gud2lkdGggLyAyO1xuICAgIGRpc3QueSArPSBpbm5lclNoYXBlLmJvdW5kaW5nQm94LmhlaWdodCAvIDI7XG5cbiAgICByZXR1cm4gZGlzdC54IDwgb3V0ZXJTaGFwZS5ib3VuZGluZ0JveC53aWR0aCAvIDIgJiYgZGlzdC55IDwgb3V0ZXJTaGFwZS5ib3VuZGluZ0JveC5oZWlnaHQgLyAyO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVTaGFwZVJlbGF0aW9uTWF0cml4KCkge1xuICAgIHZhciBtYXRyaXggPSBbXTtcbiAgICBtYXRyaXhbXCJjaXJjbGVcIl0gPSBbXTtcbiAgICBtYXRyaXhbXCJyZWN0YW5nbGVcIl0gPSBbXTtcbiAgICByZXR1cm4gbWF0cml4O1xufVxuXG5mdW5jdGlvbiBnZXRYWURpc3Qoc2hhcGUsIG90aGVyU2hhcGUpIHtcbiAgICB2YXIgZGlzdCA9IHt9O1xuICAgIGRpc3QueCA9IE1hdGguYWJzKHNoYXBlLmNlbnRlclggLSBvdGhlclNoYXBlLmNlbnRlclgpO1xuICAgIGRpc3QueSA9IE1hdGguYWJzKHNoYXBlLmNlbnRlclkgLSBvdGhlclNoYXBlLmNlbnRlclkpO1xuICAgIHJldHVybiBkaXN0O1xufVxuIiwidmFyIGdyaWRVdGlscyA9IHJlcXVpcmUoXCIuLy4uL3V0aWwvZ3JpZC5qc1wiKTtcblxudmFyIGNvbnZlcnRGdW5jdGlvbnMgPSB7fTtcbmNvbnZlcnRGdW5jdGlvbnNbXCJyZWN0YW5nbGVcIl0gPSBmdW5jdGlvbiByZWN0VG9HcmlkKHJlY3QsIGdyaWQsIHJvdW5kaW5nTW9kZSkge1xuICAgIHZhciBsZWZ0Um93ID0gTWF0aC5tYXgoMCwgcm91bmRpbmdNb2RlLnJvdW5kTGVmdChyZWN0LnkpKTtcbiAgICB2YXIgbGVmdENvbCA9IE1hdGgubWF4KDAsIHJvdW5kaW5nTW9kZS5yb3VuZExlZnQocmVjdC54KSk7XG5cbiAgICB2YXIgcmlnaHRSb3cgPSBNYXRoLm1pbihncmlkLnJvd3MgLSAxLCByb3VuZGluZ01vZGUucm91bmRSaWdodChyZWN0Lm1heFkpKTtcbiAgICB2YXIgcmlnaHRDb2wgPSBNYXRoLm1pbihncmlkLmNvbHMgLSAxLCByb3VuZGluZ01vZGUucm91bmRSaWdodChyZWN0Lm1heFgpKTtcblxuICAgIHZhciBzaXplID0gKHJpZ2h0Um93IC0gbGVmdFJvdyArIDEpICogKHJpZ2h0Q29sIC0gbGVmdENvbCArIDEpO1xuICAgIHZhciBwb2ludHMgPSBuZXcgQXJyYXkoc2l6ZSk7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICBmb3IgKHZhciByb3cgPSBsZWZ0Um93OyByb3cgPD0gcmlnaHRSb3c7IHJvdysrKSB7XG4gICAgICAgIGZvciAodmFyIGNvbCA9IGxlZnRDb2w7IGNvbCA8PSByaWdodENvbDsgY29sKyspIHtcbiAgICAgICAgICAgIGlmIChncmlkVXRpbHMuaXNJbnNpZGVHcmlkKGdyaWQsIHJvdywgY29sKSkge1xuICAgICAgICAgICAgICAgIHBvaW50c1tpbmRleCsrXSA9IChncmlkVXRpbHMuZ2V0SW5kZXgoZ3JpZCwgcm93LCBjb2wpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBwb2ludHM7XG59O1xuY29udmVydEZ1bmN0aW9uc1tcImNpcmNsZVwiXSA9IGZ1bmN0aW9uIGNpcmNsZVRvR3JpZChjaXJjbGUsIGdyaWQsIHJvdW5kaW5nTW9kZSkge1xuICAgIHZhciBmaXJzdFJvdyA9IE1hdGgubWF4KDAsIHJvdW5kaW5nTW9kZS5yb3VuZExlZnQoY2lyY2xlLnkpKTtcbiAgICB2YXIgbWlkUm93ID0gTWF0aC5yb3VuZChjaXJjbGUuY2VudGVyWSk7XG4gICAgdmFyIGxhc3RSb3cgPSBNYXRoLm1pbihncmlkLnJvd3MgLSAxLCByb3VuZGluZ01vZGUucm91bmRSaWdodChjaXJjbGUubWF4WSkpO1xuXG4gICAgdmFyIHBvaW50cyA9IFtdO1xuICAgIGZvciAodmFyIHJvdyA9IGZpcnN0Um93OyByb3cgPD0gbGFzdFJvdzsgcm93KyspIHtcbiAgICAgICAgdmFyIGR5ID0gbWlkUm93IC0gcm93O1xuICAgICAgICB2YXIgZHggPSBNYXRoLnNxcnQoY2lyY2xlLnJhZGl1cyAqIGNpcmNsZS5yYWRpdXMgLSBkeSAqIGR5KTtcbiAgICAgICAgdmFyIGZpcnN0Q29sID0gTWF0aC5tYXgoMCwgcm91bmRpbmdNb2RlLnJvdW5kTGVmdCgoY2lyY2xlLmNlbnRlclggLSBkeCkpKTtcbiAgICAgICAgdmFyIGxhc3RDb2wgPSBNYXRoLm1pbihncmlkLmNvbHMgLSAxLCByb3VuZGluZ01vZGUucm91bmRSaWdodCgoY2lyY2xlLmNlbnRlclggKyBkeCkpKTtcbiAgICAgICAgZm9yICh2YXIgY29sID0gZmlyc3RDb2w7IGNvbCA8PSBsYXN0Q29sOyBjb2wrKykge1xuICAgICAgICAgICAgcG9pbnRzLnB1c2goZ3JpZFV0aWxzLmdldEluZGV4KGdyaWQsIHJvdywgY29sKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcG9pbnRzO1xufTtcblxuY29udmVydEZ1bmN0aW9uc1tcIndvcm1cIl0gPSBmdW5jdGlvbiB3b3JtVG9HcmlkKHdvcm0sIGdyaWQsIHJvdW5kaW5nTW9kZSkge1xuICAgIHJldHVybiBjb252ZXJ0RnVuY3Rpb25zW1wiY2lyY2xlXCJdKHtcbiAgICAgICAgY2VudGVyWDogd29ybS5jZW50ZXJYLFxuICAgICAgICBjZW50ZXJZOiB3b3JtLmNlbnRlclksXG4gICAgICAgIHg6IHdvcm0uY2VudGVyWCAtIHdvcm0ucmFkaXVzLFxuICAgICAgICB5OiB3b3JtLmNlbnRlclkgLSB3b3JtLnJhZGl1cyxcbiAgICAgICAgbWF4WDogd29ybS5jZW50ZXJYICsgd29ybS5yYWRpdXMsXG4gICAgICAgIG1heFk6IHdvcm0uY2VudGVyWSArIHdvcm0ucmFkaXVzLFxuICAgICAgICByYWRpdXM6IHdvcm0ucmFkaXVzXG4gICAgfSwgZ3JpZCwgcm91bmRpbmdNb2RlKTtcbn07XG5cbmZ1bmN0aW9uIGNyZWF0ZVJvdW5kaW5nTW9kZShyb3VuZExlZnQsIHJvdW5kUmlnaHQpIHtcbiAgICByZXR1cm4ge3JvdW5kTGVmdDogcm91bmRMZWZ0LCByb3VuZFJpZ2h0OiByb3VuZFJpZ2h0fTtcbn1cblxudmFyIFNoYXBlVG9HcmlkQ29udmVydGVyID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuU2hhcGVUb0dyaWRDb252ZXJ0ZXIuUm91bmRpbmdNb2RlcyA9IHt9O1xuU2hhcGVUb0dyaWRDb252ZXJ0ZXIuUm91bmRpbmdNb2Rlcy5ST1VORCA9IGNyZWF0ZVJvdW5kaW5nTW9kZShNYXRoLnJvdW5kLCBNYXRoLnJvdW5kKTtcblNoYXBlVG9HcmlkQ29udmVydGVyLlJvdW5kaW5nTW9kZXMuQ09OVEFJTk1FTlQgPSBjcmVhdGVSb3VuZGluZ01vZGUoTWF0aC5jZWlsLCBNYXRoLmZsb29yKTtcblNoYXBlVG9HcmlkQ29udmVydGVyLlJvdW5kaW5nTW9kZXMuSU5URVJTRUNUSU9OID0gY3JlYXRlUm91bmRpbmdNb2RlKE1hdGguZmxvb3IsIE1hdGguY2VpbCk7XG5cblNoYXBlVG9HcmlkQ29udmVydGVyLmNyZWF0ZVNoYXBlVG9HcmlkQ29udmVydGVyID0gZnVuY3Rpb24gY3JlYXRlU2hhcGVUb0dyaWRDb252ZXJ0ZXIoKSB7XG4gICAgZnVuY3Rpb24gY29udmVydChzaGFwZSwgZ3JpZCwgcm91bmRpbmdNb2RlKSB7XG4gICAgICAgIHZhciB0eXBlID0gc2hhcGUudHlwZSB8fCBcIndvcm1cIjtcbiAgICAgICAgdmFyIGNvbnZlcnRGdW5jdGlvbiA9IGNvbnZlcnRGdW5jdGlvbnNbdHlwZV07XG5cbiAgICAgICAgcm91bmRpbmdNb2RlID0gcm91bmRpbmdNb2RlIHx8IFNoYXBlVG9HcmlkQ29udmVydGVyLlJvdW5kaW5nTW9kZXMuUk9VTkQ7XG5cbiAgICAgICAgaWYoc2hhcGUpXG4gICAgICAgIHJldHVybiBjb252ZXJ0RnVuY3Rpb24oc2hhcGUsIGdyaWQsIHJvdW5kaW5nTW9kZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29udmVydDogY29udmVydFxuICAgIH07XG59OyIsInZhciBzaGFwZUZhY3RvcnkgPSByZXF1aXJlKFwiLi4vc2hhcGUtZmFjdG9yeS5qc1wiKTtcbnZhciBzaGFwZVNwYXRpYWxSZWxhdGlvbnMgPSByZXF1aXJlKFwiLi4vc2hhcGUtc3BhdGlhbC1yZWxhdGlvbnMuanNcIik7XG5cbmRlc2NyaWJlKFwiU2hhcGUgc3BhdGlhbCByZWxhdGlvbnNcIiwgZnVuY3Rpb24oKSB7XG5cbiAgICBpdChcInNob3VsZCBkZXRlY3QgY2lyY2xlIGluIHJlY3RhbmdsZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNpcmNsZSA9IHNoYXBlRmFjdG9yeS5jcmVhdGVDaXJjbGUoMi44LCAwLjEsIDAuMSk7XG4gICAgICAgIHZhciByZWN0YW5nbGUgPSBzaGFwZUZhY3RvcnkuY3JlYXRlUmVjdGFuZ2xlKDYsIDYsIDAsIDApO1xuICAgICAgICBleHBlY3Qoc2hhcGVTcGF0aWFsUmVsYXRpb25zLmNvbnRhaW5zKHJlY3RhbmdsZSwgY2lyY2xlKSkudG9CZVRydXRoeSgpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJzaG91bGQgbm90IGRldGVjdCBjaXJjbGUgb3V0c2lkZSBvZiByZWN0YW5nbGVcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjaXJjbGUgPSBzaGFwZUZhY3RvcnkuY3JlYXRlQ2lyY2xlKDMsIDAuOSwgMC45KTtcbiAgICAgICAgdmFyIHJlY3RhbmdsZSA9IHNoYXBlRmFjdG9yeS5jcmVhdGVSZWN0YW5nbGUoNiwgNiwgMSwgMSk7XG4gICAgICAgIGV4cGVjdChzaGFwZVNwYXRpYWxSZWxhdGlvbnMuY29udGFpbnMocmVjdGFuZ2xlLCBjaXJjbGUpKS50b0JlRmFsc3koKTtcbiAgICB9KTtcblxuICAgIGl0KFwic2hvdWxkIGRldGVjdCByZWN0YW5nbGUgaW4gY2lyY2xlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcmVjdGFuZ2xlMSA9IHNoYXBlRmFjdG9yeS5jcmVhdGVSZWN0YW5nbGUoNiwgMiwgMSwgMyk7XG4gICAgICAgIHZhciByZWN0YW5nbGUyID0gc2hhcGVGYWN0b3J5LmNyZWF0ZVJlY3RhbmdsZSg0LCA0LCAyLCAxKTtcbiAgICAgICAgdmFyIGNpcmNsZSA9IHNoYXBlRmFjdG9yeS5jcmVhdGVDaXJjbGUoNCwgMCwgMCk7XG4gICAgICAgIGV4cGVjdChzaGFwZVNwYXRpYWxSZWxhdGlvbnMuY29udGFpbnMoY2lyY2xlLCByZWN0YW5nbGUxKSkudG9CZVRydXRoeSgpO1xuICAgICAgICBleHBlY3Qoc2hhcGVTcGF0aWFsUmVsYXRpb25zLmNvbnRhaW5zKGNpcmNsZSwgcmVjdGFuZ2xlMikpLnRvQmVUcnV0aHkoKTtcbiAgICB9KTtcblxuICAgIGl0KFwic2hvdWxkIG5vdCBkZXRlY3QgcmVjdGFuZ2xlIG91dHNpZGUgb2YgY2lyY2xlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcmVjdGFuZ2xlID0gc2hhcGVGYWN0b3J5LmNyZWF0ZVJlY3RhbmdsZSg1LCA1LCAyLCAxKTtcbiAgICAgICAgdmFyIGNpcmNsZSA9IHNoYXBlRmFjdG9yeS5jcmVhdGVDaXJjbGUoNCwgMCwgMCk7XG4gICAgICAgIGV4cGVjdChzaGFwZVNwYXRpYWxSZWxhdGlvbnMuY29udGFpbnMoY2lyY2xlLCByZWN0YW5nbGUpKS50b0JlRmFsc3koKTtcbiAgICB9KTtcblxufSk7IiwiZnVuY3Rpb24gZm9sbG93VHJhamVjdG9yeSh0cmFqZWN0b3J5LCB0aW1lKSB7XG4gICAgdmFyIHBlcmNlbnRhZ2UgPSB0aW1lIC8gdHJhamVjdG9yeS5kdXJhdGlvbjtcbiAgICBwZXJjZW50YWdlID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgcGVyY2VudGFnZSkpO1xuICAgIHZhciB4ID0gdHJhamVjdG9yeS5zdGFydFggKyBwZXJjZW50YWdlKih0cmFqZWN0b3J5LmVuZFggLSB0cmFqZWN0b3J5LnN0YXJ0WCk7XG4gICAgdmFyIHkgPSB0cmFqZWN0b3J5LnN0YXJ0WSArIHBlcmNlbnRhZ2UqKHRyYWplY3RvcnkuZW5kWSAtIHRyYWplY3Rvcnkuc3RhcnRZKTtcbiAgICB2YXIgZGlyZWN0aW9uID0gdHJhamVjdG9yeS5zdGFydERpcmVjdGlvbiArIHBlcmNlbnRhZ2UqKHRyYWplY3RvcnkuZW5kRGlyZWN0aW9uIC0gdHJhamVjdG9yeS5zdGFydERpcmVjdGlvbik7XG4gICAgaWYgKHRyYWplY3RvcnkudHlwZSA9PT0gXCJhcmNcIikge1xuICAgICAgICB2YXIgYXJjQW5nbGUgPSB0cmFqZWN0b3J5LmFyY1N0YXJ0QW5nbGUgKyBwZXJjZW50YWdlKih0cmFqZWN0b3J5LmFyY0VuZEFuZ2xlIC0gdHJhamVjdG9yeS5hcmNTdGFydEFuZ2xlKTtcbiAgICAgICAgeCA9IHRyYWplY3RvcnkuYXJjQ2VudGVyWCArIHRyYWplY3RvcnkuYXJjUmFkaXVzKk1hdGguY29zKGFyY0FuZ2xlKTtcbiAgICAgICAgeSA9IHRyYWplY3RvcnkuYXJjQ2VudGVyWSArIHRyYWplY3RvcnkuYXJjUmFkaXVzKk1hdGguc2luKGFyY0FuZ2xlKTtcbiAgICB9XG4gICAgcmV0dXJuIHsgeCwgeSwgZGlyZWN0aW9uIH07XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVRyYWplY3RvcnkoeyBzdGFydFgsIHN0YXJ0WSwgc3RhcnREaXJlY3Rpb24sIHNwZWVkLCB0dXJuaW5nVmVsb2NpdHksIGR1cmF0aW9uIH0pIHtcbiAgICB2YXIgdHJhamVjdG9yeSA9IHtcbiAgICAgICAgZHVyYXRpb24sXG4gICAgICAgIHN0YXJ0WCxcbiAgICAgICAgc3RhcnRZLFxuICAgICAgICBzdGFydERpcmVjdGlvbixcbiAgICAgICAgc3BlZWQsXG4gICAgICAgIHR1cm5pbmdWZWxvY2l0eVxuICAgIH07XG5cbiAgICB2YXIgeERpZmYgPSAwO1xuICAgIHZhciB5RGlmZiA9IDA7XG4gICAgaWYgKHNwZWVkID09PSAwKSB7XG4gICAgICAgIC8vIDAgZGlhbWV0ZXIgYXJjXG4gICAgICAgIHRyYWplY3RvcnkudHlwZSA9IFwic3RpbGxfYXJjXCI7XG4gICAgICAgIHhEaWZmID0gMDtcbiAgICAgICAgeURpZmYgPSAwO1xuICAgIH0gZWxzZSBpZiAodHVybmluZ1ZlbG9jaXR5ID09PSAwKSB7XG4gICAgICAgIC8vIFN0cmFpZ2h0IGxpbmVcbiAgICAgICAgdHJhamVjdG9yeS50eXBlID0gXCJzdHJhaWdodFwiO1xuICAgICAgICB4RGlmZiA9IGR1cmF0aW9uICogc3BlZWQgKiBNYXRoLmNvcyhzdGFydERpcmVjdGlvbik7XG4gICAgICAgIHlEaWZmID0gZHVyYXRpb24gKiBzcGVlZCAqIE1hdGguc2luKHN0YXJ0RGlyZWN0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBDaXJjbGUgYXJjXG4gICAgICAgIHRyYWplY3RvcnkudHlwZSA9IFwiYXJjXCI7XG4gICAgICAgIHZhciByYWRpdXMgPSBzcGVlZCAvIHR1cm5pbmdWZWxvY2l0eTtcbiAgICAgICAgdmFyIGFuZ2xlID0gZHVyYXRpb24gKiB0dXJuaW5nVmVsb2NpdHk7XG5cbiAgICAgICAgdHJhamVjdG9yeS5hcmNDZW50ZXJYID0gdHJhamVjdG9yeS5zdGFydFggLSByYWRpdXMgKiBNYXRoLmNvcyhzdGFydERpcmVjdGlvbiAtIE1hdGguUEkgLyAyKTtcbiAgICAgICAgdHJhamVjdG9yeS5hcmNDZW50ZXJZID0gdHJhamVjdG9yeS5zdGFydFkgLSByYWRpdXMgKiBNYXRoLnNpbihzdGFydERpcmVjdGlvbiAtIE1hdGguUEkgLyAyKTtcbiAgICAgICAgdHJhamVjdG9yeS5hcmNSYWRpdXMgPSBNYXRoLmFicyhyYWRpdXMpO1xuICAgICAgICB0cmFqZWN0b3J5LmFyY1N0YXJ0QW5nbGUgPSBzdGFydERpcmVjdGlvbiAtIHJhZGl1cyAvIE1hdGguYWJzKHJhZGl1cykgKiBNYXRoLlBJIC8gMjtcbiAgICAgICAgdHJhamVjdG9yeS5hcmNBbmdsZURpZmYgPSBhbmdsZTtcbiAgICAgICAgdHJhamVjdG9yeS5hcmNFbmRBbmdsZSA9IHRyYWplY3RvcnkuYXJjU3RhcnRBbmdsZSArIHRyYWplY3RvcnkuYXJjQW5nbGVEaWZmO1xuXG4gICAgICAgIHhEaWZmID0gLXJhZGl1cyAqIChNYXRoLmNvcyhzdGFydERpcmVjdGlvbiAtIE1hdGguUEkgLyAyKSArIE1hdGguY29zKHN0YXJ0RGlyZWN0aW9uICsgTWF0aC5QSSAvIDIgKyBhbmdsZSkpO1xuICAgICAgICB5RGlmZiA9IC1yYWRpdXMgKiAoTWF0aC5zaW4oc3RhcnREaXJlY3Rpb24gLSBNYXRoLlBJIC8gMikgKyBNYXRoLnNpbihzdGFydERpcmVjdGlvbiArIE1hdGguUEkgLyAyICsgYW5nbGUpKTtcbiAgICB9XG4gICAgdHJhamVjdG9yeS5lbmRYID0gdHJhamVjdG9yeS5zdGFydFggKyB4RGlmZjtcbiAgICB0cmFqZWN0b3J5LmVuZFkgPSB0cmFqZWN0b3J5LnN0YXJ0WSArIHlEaWZmO1xuICAgIHRyYWplY3RvcnkuZW5kRGlyZWN0aW9uID0gdHJhamVjdG9yeS5zdGFydERpcmVjdGlvbiArIHR1cm5pbmdWZWxvY2l0eSAqIGR1cmF0aW9uO1xuICAgIHJldHVybiB0cmFqZWN0b3J5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBjcmVhdGVUcmFqZWN0b3J5LFxuICAgIGZvbGxvd1RyYWplY3Rvcnlcbn07XG4iLCJ2YXIgY2xvbmUgPSByZXF1aXJlKFwiLi9jbG9uZVwiKTtcblxuZGVzY3JpYmUoXCJjbG9uZVwiLCBmdW5jdGlvbiAoKSB7XG5cbiAgICBpdChcInRlc3QgYmFzaWMgY2xvbmluZ1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBvYmplY3QgPSB7XG4gICAgICAgICAgICAxOiB7XG4gICAgICAgICAgICAgICAgZGVlcExpc3Q6IFtdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbGlzdDogW11cbiAgICAgICAgfTtcblxuICAgICAgICBleHBlY3QoY2xvbmUob2JqZWN0KSkudG9FcXVhbChvYmplY3QpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJ0ZXN0IGRlZXAgY2xvbmluZ1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBvYmplY3QgPSB7XG4gICAgICAgICAgICAxOiB7XG4gICAgICAgICAgICAgICAgZGVlcExpc3Q6IFtdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbGlzdDogW11cbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgY2xvbmVkT2JqZWN0ID0gY2xvbmUob2JqZWN0KTtcbiAgICAgICAgY2xvbmVkT2JqZWN0Lmxpc3QucHVzaCgxKTtcbiAgICAgICAgY2xvbmVkT2JqZWN0WzFdLmRlZXBMaXN0LnB1c2goMik7XG4gICAgICAgIGV4cGVjdChvYmplY3QpLnRvRXF1YWwoe1xuICAgICAgICAgICAgMToge1xuICAgICAgICAgICAgICAgIGRlZXBMaXN0OiBbXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxpc3Q6IFtdXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGV4cGVjdChjbG9uZWRPYmplY3QpLnRvRXF1YWwoe1xuICAgICAgICAgICAgMToge1xuICAgICAgICAgICAgICAgIGRlZXBMaXN0OiBbMl1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsaXN0OiBbMV1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTsiLCJmdW5jdGlvbiBpc1ByaW1pdGl2ZShvYmplY3QpIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iamVjdCAhPT0gJ29iamVjdCcgfHwgIG9iamVjdCA9PT0gbnVsbCB8fCBvYmplY3QgPT09IHVuZGVmaW5lZFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNsb25lKHNvdXJjZSkge1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoc291cmNlKSkge1xuICAgICAgICB2YXIgY2xvbmVkQXJyYXkgPSBbXTtcbiAgICAgICAgc291cmNlLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIGlmIChpc1ByaW1pdGl2ZShpdGVtKSkge1xuICAgICAgICAgICAgICAgIGNsb25lZEFycmF5LnB1c2goaXRlbSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNsb25lZEFycmF5LnB1c2goY2xvbmUoaXRlbSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGNsb25lZEFycmF5O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBjbG9uZWRPYmplY3QgPSB7fTtcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgICAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBzb3VyY2VbcHJvcF07XG4gICAgICAgICAgICAgICAgaWYgKGlzUHJpbWl0aXZlKHZhbHVlKSl7XG4gICAgICAgICAgICAgICAgICAgIGNsb25lZE9iamVjdFtwcm9wXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNsb25lZE9iamVjdFtwcm9wXSA9IGNsb25lKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2xvbmVkT2JqZWN0O1xuICAgIH1cbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmb3JFYWNoKGNvbGxlY3Rpb24sIGNhbGxiYWNrKSB7XG4gICAgZm9yICh2YXIgayBpbiBjb2xsZWN0aW9uKSB7XG4gICAgICAgIGlmIChjb2xsZWN0aW9uLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhjb2xsZWN0aW9uW2tdLCBrKTtcbiAgICAgICAgfVxuICAgIH1cbn07IiwidmFyIHV0aWxzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxudXRpbHMuZ2V0SW5kZXggPSBmdW5jdGlvbiBnZXRJbmRleChncmlkLCByb3csIGNvbCkge1xuICAgIHJldHVybiByb3cgKiBncmlkLmNvbHMgKyBjb2w7XG59O1xuXG51dGlscy5nZXRSb3dDb2wgPSBmdW5jdGlvbiBnZXRSb3dDb2woZ3JpZCwgaW5kZXgpIHtcbiAgICB2YXIgcm93Q29sID0ge307XG4gICAgcm93Q29sLnJvdyA9IE1hdGguZmxvb3IoaW5kZXggLyBncmlkLmNvbHMpO1xuICAgIHJvd0NvbC5jb2wgPSBpbmRleCAtIHJvd0NvbC5yb3cgKiBncmlkLmNvbHM7XG4gICAgcmV0dXJuIHJvd0NvbDtcbn07XG5cbnV0aWxzLmlzSW5zaWRlR3JpZCA9IGZ1bmN0aW9uIGlzSW5zaWRlR3JpZChncmlkLCByb3csIGNvbCkge1xuICAgIHJldHVybiByb3cgPj0gMCAmJiByb3cgPCBncmlkLnJvd3MgJiYgY29sID49IDAgJiYgY29sIDwgZ3JpZC5jb2xzO1xufTsiXX0=
