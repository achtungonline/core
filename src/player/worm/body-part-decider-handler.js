module.exports = function BodyPartDeciderHandler(jumpFactory) {

    var jumps = {};

    function updateJump(deltaTime, worm) {
        if (!jumps[worm.id]) {
            jumps[worm.id] = jumpFactory.create();
        }
        jumps[worm.id].update(deltaTime);
    }

    function decide(deltaTime, worm, bodyPart) {
        updateJump(deltaTime, worm);
        if (jumps[worm.id].isJumping()) {
            return;
        }
        return bodyPart;
    }

    function register(worm) {

    }

    function unRegister(worm) {

    }


    return {
        register: register,
        unRegister: unRegister,
        decide: decide
    };
};