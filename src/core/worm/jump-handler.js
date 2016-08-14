var timeBasedChance = require("../time-based-chance.js");
var constants = require("../constants.js");

module.exports = function JumpHandler() {
    var timeBasedChanceTrigger = timeBasedChance.TimeBasedChanceTrigger(timeBasedChance.calculators.LinearTimeBasedChanceCalculator(constants.JUMP_CHANCE));

    function update(gameState, deltaTime, worm) {
        function updateRemainingJumpTime() {
            worm.jump.remainingJumpTime -= deltaTime;
        }

        function updateTimeSinceLastJump() {
            worm.jump.timeSinceLastJump += deltaTime;
        }

        function startJumping() {
            if (worm.speed > 0) {
                worm.jump.remainingJumpTime = constants.JUMP_LENGTH / worm.speed;
            } else {
                worm.jump.remainingJumpTime = 0;
            }
            worm.jump.timeSinceLastJump = 0;
        }

        if (worm.jump.remainingJumpTime > 0) {
            updateRemainingJumpTime();
            return;
        }

        updateTimeSinceLastJump();

        if (worm.jump.timeSinceLastJump < constants.JUMP_MIN_FREQUENCY) {
            return;
        }

        timeBasedChanceTrigger.update(gameState, deltaTime, startJumping);
    }

    return {
        update: update
    };
};