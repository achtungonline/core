module.exports = function JumpHandler(timeBasedChanceTrigger, jumpLength, jumpMinFrequency) {

    function isJumping(worm) {
        return worm.jump.remainingJumpTime > 0;
    }

    function update(deltaTime, worm) {
        function updateRemainingJumpTime() {
            worm.jump.remainingJumpTime -= deltaTime;
        }
        function updateTimeSinceLastJump() {
            worm.jump.timeSinceLastJump += deltaTime;
        }
        function startJumping() {
            worm.jump.remainingJumpTime = jumpLength;
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

        timeBasedChanceTrigger.update(deltaTime, startJumping);
    }

    return {
        isJumping: isJumping,
        update: update
    };
};