var timeBasedChance = require("../util/time-based-chance.js");
var constants = require("../constants.js");
var gameStateFunctions = require("../game-state-functions.js");

module.exports = function JumpHandler() {
    var timeBasedChanceTrigger = timeBasedChance.TimeBasedChanceTrigger(timeBasedChance.calculators.ExpoTimeBasedChanceCalculator(constants.JUMP_CHANCE));

    function update(gameState, deltaTime) {
        gameStateFunctions.forEachAliveWorm(gameState, function (worm) {
            if (worm.jump.remainingJumpTime <= 0) {
                worm.jump.timeSinceLastJump += deltaTime;
                if (worm.jump.timeSinceLastJump > constants.JUMP_COOLDOWN) {
                    function startJumping() {
                        if (worm.speed > 0) {
                            worm.jump.remainingJumpTime = constants.JUMP_LENGTH / worm.speed;
                        } else {
                            worm.jump.remainingJumpTime = 0;
                        }
                        worm.jump.timeSinceLastJump = 0;
                    }

                    timeBasedChanceTrigger.update(gameState, deltaTime, startJumping);
                }
            } else {
                worm.jump.remainingJumpTime -= deltaTime;
            }
        });
    }

    return {
        update: update
    };
};