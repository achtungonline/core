module.exports = function RandomAI(game) {

    var updateTicks = 30;

    function randInt (low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    }

    function update(gameState, player) {
        updateTicks += 1;
        if (updateTicks >= 30) {
            game.setPlayerSteering(player, randInt(-1, 2));
            updateTicks = 0;
        }
    }

    return {
        update: update
    }

};