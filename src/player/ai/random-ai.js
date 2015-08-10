module.exports = function RandomAI(player) {

    var updateTicks = 30;

    function randInt (low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    }

    function update() {
        updateTicks += 1;
        if (updateTicks >= 30) {
            player.steering = randInt(-1, 2);
            updateTicks = 0;
        }
    }

    return {
        update: update
    }

};