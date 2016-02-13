var circleShape = require("./../geometry/shape/circle.js");
var PowerUp = require("./power-up.js");
var clone = require("./../util/clone.js");
var gameStateFunctions = require("./../game-state-functions.js");
var random = require("./../util/random.js");

var MAX_POWER_UP_SPAWN_ATTEMPTS = 100;
var POWER_UP_SHAPE = circleShape.Circle(40);

module.exports = function PowerUpHandler(deps) {

    deps.collisionHandler.on(deps.collisionHandler.events.WORM_POWER_UP_COLLISION, function (gameState, worm, powerUp) {
        var powerUps = gameState.powerUps;
        for (var i = 0; i < powerUps.length; i++) {
            if (powerUps[i].id === powerUp.id) {
                deps.effectHandler.activateEffect(gameState, worm.id, powerUp.id);

                powerUps.splice(i, 1);
                console.log("power up: " + powerUp.id + " of effect type: " + powerUp.effectType + " was taken.");
                return;
            }
        }
    });


    function update(deltaTime, gameState) {
        function attemptGetPowerUpWithRandomPos(powerUp) {
            function isCollidingWithWorms(shape) {
                for (var i in gameState.worms) {
                    var worm = gameState.worms[i];
                    if (deps.shapeSpatialRelations.intersects(worm.head, shape)) {
                        return true;
                    }
                }
                return false;
            }

            function isCollidingWithPowerUps(shape) {
                for (var i in gameState.powerUps) {
                    var powerUp = gameState.powerUps[i];
                    if (deps.shapeSpatialRelations.intersects(powerUp.shape, shape)) {
                        return true;
                    }
                }
                return false;
            }

            function getPowerUpShapeInsidePlayableMapArea(powerUp) {
                return deps.mapUtils.getShapeRandomlyInsidePlayableArea(gameState, gameState.map, powerUp.shape);
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
            var powerUpDefinition = random.randomObjectValue(gameState, gameStateFunctions.getPowerUpDefinitions);
            var powerUp = PowerUp(deps.idGenerator(), powerUpDefinition.name, powerUpDefinition.effectType, clone(POWER_UP_SHAPE), powerUpDefinition.effectStrength, powerUpDefinition.effectDuration, powerUpDefinition.affects);
            powerUp = attemptGetPowerUpWithRandomPos(powerUp);
            if (powerUp !== undefined) {
                console.log("power up: " + powerUp.id + " of effect type: " + powerUp.effectType + " spawned.");
                gameState.powerUps.push(powerUp);
            }
        }

        deps.timeBasedChanceTrigger.update(gameState, deltaTime, attemptSpawnRandomPowerUp);
    }

    return {
        update: update
    };
};