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

    function getNextJumpTimer() {
        return Math.max(0, lastJumpTimer - jumpMinFrequency);
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

        var nextJumpTimer = getNextJumpTimer();

        timeBasedChanceTrigger.update(deltaTime, nextJumpTimer, startJumping);
    }

    return {
        isJumping: isJumping,
        update: update
    }
};