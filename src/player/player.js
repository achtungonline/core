var player = module.exports = {};

player.steering = {};
player.steering.LEFT = -1;
player.steering.RIGHT = 1;
player.steering.STRAIGHT = 0;

player.Player = function (id, alive) {
    var steering = player.steering.STRAIGHT;

    return {
        id: id,
        steering: steering,
        alive: alive
    };
};