import * as constants from "./constants.js";
import * as gsf from "./game-state-functions.js";
import * as shapeSpatialRelations from "./geometry/shape-spatial-relations.js";
import * as shapeModifierI from "./geometry/shape-modifier-immutable.js";
import * as random from "./util/random.js";
import clone from "./util/clone.js";
import forEach from "./util/for-each.js";
import * as trajectoryUtil from "./geometry/trajectory/trajectory-util.js";
import * as ShapeToGridConverter from "./geometry/shape-to-grid-converter.js";
var shapeToGridConverter = ShapeToGridConverter.createShapeToGridConverter();
import * as timeBasedChance from "./util/time-based-chance.js";
var powerUpTimeBasedChanceTrigger = timeBasedChance.TimeBasedChanceTrigger(timeBasedChance.calculators.LinearTimeBasedChanceCalculator(constants.POWER_UP_SPAWN_CHANCE));

import * as speedEffectDefinition from "./power-up/effect-definitions/speed.js";
import * as sizeEffectDefinition from "./power-up/effect-definitions/size.js";
import * as turningSpeedEffectDefinition from "./power-up/effect-definitions/turning-speed.js";
import * as wormSwitchEffectDefinition from "./power-up/effect-definitions/worm-switch.js";
import * as drunkEffectDefinition from "./power-up/effect-definitions/drunk.js";
import * as clearEffectDefinition from "./power-up/effect-definitions/clear.js";
import * as superJumpEffectDefinition from "./power-up/effect-definitions/super-jump.js";
import * as tronTurnEffectDefinition from "./power-up/effect-definitions/tron-turn.js";
import * as twinEffectDefinition from "./power-up/effect-definitions/twin.js";
import * as wallHackEffectDefinition from "./power-up/effect-definitions/wall-hack.js";

var effectDefinitions = {};
effectDefinitions[speedEffectDefinition.type] = speedEffectDefinition;
effectDefinitions[sizeEffectDefinition.type] = sizeEffectDefinition;
effectDefinitions[turningSpeedEffectDefinition.type] = turningSpeedEffectDefinition;
effectDefinitions[wormSwitchEffectDefinition.type] = wormSwitchEffectDefinition;
effectDefinitions[drunkEffectDefinition.type] = drunkEffectDefinition;
effectDefinitions[clearEffectDefinition.type] = clearEffectDefinition;
effectDefinitions[superJumpEffectDefinition.type] = superJumpEffectDefinition;
effectDefinitions[tronTurnEffectDefinition.type] = tronTurnEffectDefinition;
effectDefinitions[twinEffectDefinition.type] = twinEffectDefinition;
effectDefinitions[wallHackEffectDefinition.type] = wallHackEffectDefinition;

function activatePowerUp(gameState, powerUpId, wormId) {
    var index = gameState.powerUps.findIndex(powerUp => powerUp.id === powerUpId);
    var powerUp = gameState.powerUps[index];
    var effect = effectDefinitions[powerUp.effectType].activate({
        gameState,
        strength: powerUp.effectStrength,
        duration: powerUp.effectDuration,
        wormId,
        affects: powerUp.affects
    });
    if (effect) {
        effect.name = powerUp.name;
        effect.time = gameState.gameTime;

        if (powerUp.affects === "self" || powerUp.affects === "all") {
            gsf.addEffect(gameState, effect);
        }
        if (powerUp.affects === "others" || powerUp.affects === "all") {
            gsf.getAliveEnemyWorms(gameState, wormId).forEach(function (worm) {
                var clonedEffect = clone(effect);
                clonedEffect.wormId = worm.id;
                gsf.addEffect(gameState, clonedEffect);
            })
        }
    }
    gsf.removePowerUp(gameState, powerUpId);
}

function getRandomPositionInsidePlayableArea(gameState, minDistance) {
    var map = gameState.map;

    function intersectsBlockingShapes(shape) {
        for (var i = 0; i < map.blockingShapes.length; i++) {
            if (shapeSpatialRelations.intersects(map.blockingShapes[i], shape)) {
                return true;
            }
        }
        return false;
    }

    minDistance = minDistance || 0;
    var pos = {};
    var i = 0;
    while (i < 100000) {
        pos.x = random.random(gameState) * map.width;
        pos.y = random.random(gameState) * map.height;
        var shape = {centerX: pos.x, centerY: pos.y, radius: minDistance};
        if (shapeSpatialRelations.contains(map.shape, shape) && !intersectsBlockingShapes(shape)) {
            return pos;
        }
        i++;
    }
    throw Error("Failed to find a position inside playable area for the given shape");
}

function getWormDirection(gameState, wormId) {
    return transformValueUsingEffects(gameState, wormId, gsf.getWorm(gameState, wormId).direction, "changeDirection");
}

function getWormRadius(gameState, wormId) {
    var newSize = transformValueUsingEffects(gameState, wormId, gsf.getWorm(gameState, wormId).radius, "changeWormRadius");
    return Math.max(1, newSize);
}

function getWormSpeed(gameState, wormId) {
    var newSpeed = transformValueUsingEffects(gameState, wormId, gsf.getWorm(gameState, wormId).speed, "changeSpeed");
    return Math.max(5, newSpeed);
}

function getWormTurningSpeed(gameState, wormId) {
    var worm = gsf.getWorm(gameState, wormId);
    var speedUp = getWormSpeed(gameState, wormId) / worm.speed;
    var initValue = worm.turningSpeed * speedUp;
    return Math.min(5, transformValueUsingEffects(gameState, wormId, initValue, "changeTurningSpeed"));
}

function getWormTurningVelocity(gameState, wormId) {
    var turningVelocity;
    var player = gsf.getPlayer(gameState, gsf.getWorm(gameState, wormId).playerId);
    var tronTurnEffects = gsf.getWormEffects(gameState, wormId, "tronTurn");
    if (tronTurnEffects.length > 0) {
        turningVelocity = effectDefinitions["tronTurn"].getWormTurningVelocity(gameState, tronTurnEffects[0]);
    } else {
        turningVelocity = player.steering * getWormTurningSpeed(gameState, wormId);
    }
    return transformValueUsingEffects(gameState, wormId, turningVelocity, "changeTurningVelocity");
}

function isWormJumping(gameState, wormId) {
    return transformValueUsingEffects(gameState, wormId, gsf.getWorm(gameState, wormId).jump.remainingJumpTime > 0, "changeIsJumping");
}

function killPlayer(gameState, playerId) {
    var player = gsf.getPlayer(gameState, playerId);
    player.alive = false;
    gameState.gameEvents.push({
        type: "player_died",
        time: gameState.gameTime,
        playerId: playerId
    });
}

function killWorm(gameState, wormId) {
    var worm = gsf.getWorm(gameState, wormId);
    worm.alive = false;
    addWormPathSegment(gameState, createWormPathSegmentWormDied(gameState, wormId));

    if (gsf.getAliveWorms(gameState, worm.playerId).length === 0) {
        killPlayer(gameState, worm.playerId);
    }
}

/**
 * Transform the given initValue based on effects owned by wormId. Each effect owned by wormId that has the function effectFunctionName in its definition will be called and the value will be changed in a pipe-line fashion.
 * Available effectFunctionNames: "changeSpeed", "changeTurningSpeed", "changeWormRadius"
 */
function transformValueUsingEffects(gameState, wormId, initValue, effectFunctionName) {
    /**
     * Returns all effects currently owned by wormId and that has the function effectFunctionName in its definition
     */
    function getEffectsWithFunction(gameState, wormId, effectFunctionName) {
        return gsf.getWormEffects(gameState, wormId).filter(e => effectDefinitions[e.type][effectFunctionName]);
    }

    return getEffectsWithFunction(gameState, wormId, effectFunctionName).reduce(function (accValue, effect) {
        var effectHandler = effectDefinitions[effect.type];
        return effectHandler[effectFunctionName](gameState, effect, accValue);
    }, initValue);
}

/**
 * Update what should happen on collision. Either on wall, worm or on power up
 */
function updateCollision(gameState) {
    function wormMapCollision(gameState, segment) {
        return !shapeSpatialRelations.contains(gameState.map.shape, {centerX: segment.endX, centerY: segment.endY, radius: segment.size});
    }

    function wormWormCollision(gameState, worm, segment) {
        var playArea = gameState.playArea;
        var cells = shapeToGridConverter.convert({centerX: segment.endX, centerY: segment.endY, radius: segment.size}, playArea, ShapeToGridConverter.RoundingModes.CONTAINMENT);
        return cells.some(function (cell) {
            var value = playArea.grid[cell];
            if (value !== constants.PLAY_AREA_FREE) { // TODO Utility function to check if worm-id
                if (!(worm.distanceTravelled - worm.distanceTravelledFromCells[cell] <= constants.IMMUNITY_DISTANCE_MULTIPLIER * segment.size)) {
                    var twinEffects = gsf.getWormEffects(gameState, worm.id, "twin");
                    if (twinEffects.length > 0) {
                        return twinEffects.map(te => gsf.getWorm(gameState, te.twinWormId))
                                .filter(function (twinWorm) {
                                    return (twinWorm.distanceTravelled - twinWorm.distanceTravelledFromCells[cell] <= constants.IMMUNITY_DISTANCE_MULTIPLIER * segment.size)
                                }).length === 0;
                    }
                    return true;
                }
            }
        });
    }

    function wormPowerUpCollision(gameState, segment) {
        var powerUps = gameState.powerUps;
        var collidedPowerUps = [];
        powerUps.forEach(function (powerUp) {
            if (shapeSpatialRelations.intersects({centerX: segment.endX, centerY: segment.endY, radius: segment.size}, powerUp.shape)) {
                collidedPowerUps.push(powerUp.id);
            }
        });
        return collidedPowerUps;
    }

    gsf.forEachAliveLatestWormPathSegment(gameState, function (segment) {
        var worm = gsf.getWorm(gameState, segment.wormId);
        wormPowerUpCollision(gameState, segment).forEach(function (powerUpId) {
            activatePowerUp(gameState, powerUpId, worm.id);
        });
        if (worm.alive && !gsf.hasWormEffect(gameState, worm.id, wallHackEffectDefinition.type) && wormMapCollision(gameState, segment)) {
            killWorm(gameState, worm.id);
        }
        if (worm.alive && !segment.jump && (wormWormCollision(gameState, worm, segment))) {
            killWorm(gameState, worm.id);
        }
    });
}

function createWormPathSegment(gameState, wormId, {duration}) {
    var worm = gsf.getWorm(gameState, wormId);
    var direction = getWormDirection(gameState, wormId);
    var size = getWormRadius(gameState, wormId);
    var turningVelocity = getWormTurningVelocity(gameState, wormId);
    var jump = isWormJumping(gameState, wormId);
    var speed = gsf.isInStartPhase(gameState) ? 0 : getWormSpeed(gameState, wormId);

    return gsf.createWormPathSegment(gameState, wormId, {duration, centerX: worm.centerX, centerY: worm.centerY, direction, speed, turningVelocity, jump, size});
}


function createWormPathSegmentWormDied(gameState, wormId) {
    var wps = createWormPathSegment(gameState, wormId, {duration: 0});
    wps.type = "worm_died";
    return wps;
}

function addWormPathSegment(gameState, wormPathSegment) {
    gsf.addWormPathSegment(gameState, wormPathSegment);

    if (gsf.hasWormEffect(gameState, wormPathSegment.wormId, "wallHack")) {
        wallHackEffectDefinition.updateWorm(gameState, wormPathSegment.duration, wormPathSegment.wormId, wormPathSegment);
    }
}

/**
 * Updates each worms
 */
function updateWorms(gameState, deltaTime) {
    gsf.forEachAliveWorm(gameState, function (worm) {
        var wormPathSegment = createWormPathSegment(gameState, worm.id, {duration: deltaTime});

        //TODO: Will get removed when we no longer have collision detection based on playArea
        worm.direction += wormPathSegment.turningVelocity * deltaTime;
        worm.centerX = wormPathSegment.endX;
        worm.centerY = wormPathSegment.endY;
        worm.distanceTravelled += wormPathSegment.speed * deltaTime;

        // No body update during the start phase and also only render the body if we are not standing still
        if (getWormSpeed(gameState, worm.id) > 0 && !isWormJumping(gameState, worm.id)) {
            gsf.addPlayAreaShape(gameState, {centerX: wormPathSegment.startX, centerY: wormPathSegment.startY, radius: wormPathSegment.size}, wormPathSegment.id).forEach(function (cell) {
                worm.distanceTravelledFromCells[cell.index] = worm.distanceTravelled;
            });
        }

        addWormPathSegment(gameState, wormPathSegment);
    });
}

function updateEffects(gameState, deltaTime) {
    var effects = gameState.effects;
    for (var i = effects.length - 1; i >= 0; i--) {
        var effect = effects[i];
        effect.timeLeft -= deltaTime;
        var effectDefinition = effectDefinitions[effect.type];
        if (effectDefinition.update) {
            effectDefinition.update(gameState, deltaTime, effect)
        }
        if (effect.timeLeft <= 0) {
            gsf.removeEffect(gameState, effect.id);
        }
    }
}

function updatePlayers(gameState, deltaTime) {
    gameState.players.forEach(function (player) {
        gsf.addPlayerSteeringSegment(gameState, player.id, player.steering, deltaTime);
    });
}

function updatePowerUps(gameState, deltaTime) {
    function attemptGetPowerUpWithRandomPos(powerUp) {
        function isCollidingWithWorms(shape) {
            for (var i in gameState.worms) {
                var worm = gameState.worms[i];
                if (shapeSpatialRelations.intersects(worm, shape)) {
                    return true;
                }
            }
            return false;
        }

        function isCollidingWithPowerUps(shape) {
            for (var i in gameState.powerUps) {
                var powerUp = gameState.powerUps[i];
                if (shapeSpatialRelations.intersects(powerUp.shape, shape)) {
                    return true;
                }
            }
            return false;
        }

        var position = getRandomPositionInsidePlayableArea(gameState, powerUp.shape.radius);
        powerUp.shape = shapeModifierI.setPosition(powerUp.shape, position.x - powerUp.shape.radius, position.y - powerUp.shape.radius);
        var MAX_POWER_UP_SPAWN_ATTEMPTS = 100;
        var counter = 0;
        while (isCollidingWithWorms(powerUp.shape) || isCollidingWithPowerUps(powerUp.shape)) {
            if (counter > MAX_POWER_UP_SPAWN_ATTEMPTS) {
                return undefined;
            }
            position = getRandomPositionInsidePlayableArea(gameState, powerUp.shape.radius);
            powerUp.shape = shapeModifierI.setPosition(powerUp.shape, position.x - powerUp.shape.radius, position.y - powerUp.shape.radius);
            counter++;
        }
        return powerUp;
    }

    function attemptSpawnRandomPowerUp() {
        var totalSpawnWeight = 0;
        forEach(constants.powerUpDefinitions, function (powerUpDefinition, _) {
            totalSpawnWeight += powerUpDefinition.weightedSpawnChance;
        });
        var randomValue = random.random(gameState);
        var currentChance = 0;
        var found = false;
        forEach(constants.powerUpDefinitions, function (powerUpDefinition, _) {
            currentChance += powerUpDefinition.weightedSpawnChance / totalSpawnWeight;
            if (!found && currentChance > randomValue) {
                found = true;
                var powerUp = attemptGetPowerUpWithRandomPos({
                    name: powerUpDefinition.name,
                    effectType: powerUpDefinition.effectType,
                    shape: clone(constants.POWER_UP_SHAPE),
                    effectStrength: powerUpDefinition.effectStrength,
                    effectDuration: powerUpDefinition.effectDuration,
                    affects: powerUpDefinition.affects
                });
                if (powerUp !== undefined) {
                    gsf.addPowerUp(gameState, powerUp);
                }
            }
        });
    }

    powerUpTimeBasedChanceTrigger.update(gameState, deltaTime, attemptSpawnRandomPowerUp);
}

function updateWormJumps(gameState, deltaTime) {
    gsf.forEachAliveWorm(gameState, function (worm) {
        if (worm.jump.remainingJumpTime <= 0) {
            worm.jump.timeSinceLastJump += deltaTime;
            if (worm.jump.timeSinceLastJump > constants.JUMP_COOLDOWN) {
                function startJumping() {
                    if (worm.speed > 0) {
                        worm.jump.remainingJumpTime =  (2 * getWormRadius(gameState, worm.id) + 4 * worm.radius) / worm.speed;
                    } else {
                        worm.jump.remainingJumpTime = 0;
                    }
                    worm.jump.timeSinceLastJump = 0;
                }

                var notJumpedElapsedTime = worm.jump.timeSinceLastJump - constants.JUMP_COOLDOWN;
                var notJumpedMaxTime = 1 / constants.JUMP_CHANCE;
                var jumpChance = deltaTime / (notJumpedMaxTime - (notJumpedElapsedTime - deltaTime));
                if(jumpChance >= random.random(gameState)) {
                    startJumping();
                }
            }
        } else {
            worm.jump.remainingJumpTime -= deltaTime;
        }
    });
}

export {
    activatePowerUp,
    createWormPathSegment,
    createWormPathSegmentWormDied,
    getRandomPositionInsidePlayableArea,
    getWormDirection,
    getWormRadius,
    getWormSpeed,
    getWormTurningSpeed,
    getWormTurningVelocity,
    isWormJumping,
    killPlayer,
    killWorm,
    updateCollision,
    updateWorms,
    updateEffects,
    updatePlayers,
    updatePowerUps,
    updateWormJumps
};
