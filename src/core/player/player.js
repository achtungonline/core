var player = module.exports = {};

player.steering = {};
player.steering.LEFT = -1;
player.steering.RIGHT = 1;
player.steering.STRAIGHT = 0;

player.Player = function (id, alive) {
    var steering = player.steering.STRAIGHT;
    var steeringSegments = [];
    steeringSegments.push({
        steering: steering,
        startTime: 0,
        deltaTime: 0
    });

    return {
        id: id,
        steering: steering,
        gameTimeWhenSteeringChanged: 0,
        steeringSegments: steeringSegments,
        alive: alive
    };
};
