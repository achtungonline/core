module.exports = function JumpHandler(timeBasedChanceTrigger, jumpLength, jumpMinFrequency) {

    function isJumping(worm) {
        return worm.jump.remainingJumpTime > 0;
    }

    function update(gameState, deltaTime, worm) {
        function updateRemainingJumpTime() {
            worm.jump.remainingJumpTime -= deltaTime;
        }

        function updateTimeSinceLastJump() {
            worm.jump.timeSinceLastJump += deltaTime;
        }

        function startJumping() {
            if (worm.speed > 0) {
                worm.jump.remainingJumpTime = jumpLength / worm.speed;
            } else {
                worm.jump.remainingJumpTime = 0;
            }
            worm.jump.timeSinceLastJump = 0;
        }

        if (isJumping(worm)) {
            updateRemainingJumpTime();
            return;
        }

        updateTimeSinceLastJump();

        if (worm.jump.timeSinceLastJump < jumpMinFrequency) {
            return;
        }

        timeBasedChanceTrigger.update(gameState, deltaTime, startJumping);
    }

    return {
        isJumping: isJumping,
        update: update
    };
};