var MAX_POWER_UP_SPAWN_ATTEMPTS = 100;
var circleShape = require("./../geometry/shape/circle.js");
var PowerUp = require("./power-up.js");

module.exports = function PowerUpHandler(powerUpFunctionMap, collisionHandler, timeBasedChanceTrigger, shapeSpatialRelations, idGenerator, mapUtils, random) {

    collisionHandler.on(collisionHandler.events.WORM_POWER_UP_COLLISION, function (gameState, player, worm, powerUp) {
        var powerUps = gameState.powerUps;
        for (var i = 0; i < powerUps.length; i++) {
            if (powerUps[i].id === powerUp.id) {
                //var effect = powerUpFunctionMap[powerUp.type].activate(worm);

                powerUps.splice(i, 1);
                console.log("power up: " + powerUp.id + " of effect type: " + powerUp.effectType + " de-spawned.");
                return;
            }
        }

        //gameState.effects.push(effect);
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
                return mapUtils.getShapeRandomlyInsidePlayableArea(gameState.map, powerUp.shape, random);
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
            var powerUpType = random.randomObjectProperty(powerUpFunctionMap);
            var powerUp = PowerUp(idGenerator(), powerUpType, circleShape.Circle(15, 0, 0));//powerUpFunctionMap[powerUpType]();
            powerUp = attemptGetPowerUpWithRandomPos(powerUp);
            if (powerUp !== undefined) {
                console.log("power up: " + powerUp.id + " of effect type: " + powerUp.effectType + " spawned.");
                gameState.powerUps.push(powerUp);
            }
        }

        timeBasedChanceTrigger.update(deltaTime, attemptSpawnRandomPowerUp);
    }

    return {
        update: update
    };
};