var player = module.exports = {}

player.steering = {}
player.steering.LEFT = -1;
player.steering.RIGHT = 1;
player.steering.STRAIGHT = 0;

player.Player = function (id, worms) {
    var steering = player.steering.STRAIGHT;
    if (!worms) {
        worms = [];
    } else if (!worms.length) {
        worms = [worms];
    }

    return {
        id: id,
        worms: worms,
        steering: steering
    };
}