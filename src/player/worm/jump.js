module.exports = function Jump(timeBasedChanceTrigger, jumpLength, jumpMinFrequency) {
    var lastJumpTimer = 0;
    var jumpingTimer = 0;


    function isJumping() {
        return jumpingTimer >= 0;
    }

    function updateJumping(deltaTime) {
        jumpingTimer -= deltaTime;
    }

    function updateLastJumpTimer(deltaTime) {
        lastJumpTimer += deltaTime;
    }

    function startJumping() {
        jumpingTimer = jumpLength;
        lastJumpTimer = 0;
    }

    function update(deltaTime) {
        if (isJumping()) {
            updateJumping(deltaTime);
            return;
        }

        updateLastJumpTimer(deltaTime);

        if (lastJumpTimer < jumpMinFrequency) {
            return;
        }

        timeBasedChanceTrigger.update(deltaTime, startJumping);
    }

    return {
        isJumping: isJumping,
        update: update
    }
};