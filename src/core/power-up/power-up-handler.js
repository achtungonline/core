var clone = require("./../util/clone.js");
var coreFunctions = require("./../core-functions.js");
var random = require("./../util/random.js");
var forEach = require("./../util/for-each.js");
var shapeSpatialRelations = require("./../geometry/shape-spatial-relations.js");
var idGenerator = require("./../util/id-generator.js").indexCounterId(0);
var timeBasedChance = require("./../time-based-chance.js");
var constants = require("./../constants.js");
var timeBasedChanceTrigger = timeBasedChance.TimeBasedChanceTrigger(timeBasedChance.calculators.LinearTimeBasedChanceCalculator(constants.POWER_UP_SPAWN_CHANGE));

var MAX_POWER_UP_SPAWN_ATTEMPTS = 100;

module.exports = function PowerUpHandler({collisionHandler, effectHandler}) {
    collisionHandler.on(collisionHandler.events.WORM_POWER_UP_COLLISION, function (gameState, worm, powerUp) {
        var powerUps = gameState.powerUps;
        for (var i = 0; i < powerUps.length; i++) {
            if (powerUps[i].id === powerUp.id) {
                effectHandler.activateEffect(gameState, worm.id, powerUp.id);

                powerUps.splice(i, 1);
                return;
            }
        }
    });


    function update(deltaTime, gameState) {
        function attemptGetPowerUpWithRandomPos(powerUp) {
            function isCollidingWithWorms(shape) {
                for (var i in gameState.worms) {
                    var worm = gameState.worms[i];
                    if (shapeSpatialRelations.intersects(worm.head, shape)) {
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

            function getPowerUpShapeInsidePlayableMapArea(powerUp) {
                return coreFunctions.getShapeRandomlyInsidePlayableArea(gameState, gameState.map, powerUp.shape);
            }


            var powerUpShape = getPowerUpShapeInsidePlayableMapArea(powerUp);
            var counter = 0;
            while (isCollidingWithWorms(powerUpShape) || isCollidingWithPowerUps(powerUpShape)) {
                if (counter > MAX_POWER_UP_SPAWN_ATTEMPTS) {
                    return undefined;
                }
                powerUpShape = getPowerUpShapeInsidePlayableMapArea(powerUp);
                counter++;
            }
            powerUp.shape = powerUpShape;
            return powerUp;
        }


        function attemptSpawnRandomPowerUp() {
            var totalSpawnWeight = 0;
            forEach(coreFunctions.getPowerUpDefinitions, function (powerUpDefinition, _) {
                totalSpawnWeight += powerUpDefinition.weightedSpawnChance;
            });
            var randomValue = random.random(gameState);
            var currentChance = 0;
            var found = false;
            forEach(coreFunctions.getPowerUpDefinitions, function (powerUpDefinition, _) {
                currentChance += powerUpDefinition.weightedSpawnChance / totalSpawnWeight;
                if (!found && currentChance > randomValue) {
                    found = true;
                    var powerUp = attemptGetPowerUpWithRandomPos({
                        id: idGenerator(),
                        name: powerUpDefinition.name,
                        effectType: powerUpDefinition.effectType,
                        shape: clone(constants.POWER_UP_SHAPE),
                        effectStrength: powerUpDefinition.effectStrength,
                        effectDuration: powerUpDefinition.effectDuration,
                        affects: powerUpDefinition.affects
                    });
                    if (powerUp !== undefined) {
                        gameState.powerUps.push(powerUp);
                    }
                }
            });
        }

        timeBasedChanceTrigger.update(gameState, deltaTime, attemptSpawnRandomPowerUp);
    }

    return {
        update: update
    };
};
