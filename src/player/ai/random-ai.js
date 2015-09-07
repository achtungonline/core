module.exports = function RandomAI(game, random) {

    var updateTicks = 30;

    function update(gameState, player) {
        updateTicks += 1;
        if (updateTicks >= 30) {
            game.setPlayerSteering(player, random.randInt(-1, 2));
            updateTicks = 0;
        }
        player.worms.forEach(function (worm) {
            worm.trajectory = [{steering: player.steering, time: 1}];
        });
    }

    return {
        update: update
    };
};