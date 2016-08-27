var shapeFactory = require("./geometry/shape-factory.js");

module.exports = {
    POWER_UP_SPAWN_CHANCE: 0.12,            // Inverse of maximum time between power up spawns (seconds). 0.1 means max 10 seconds, average 5 seconds.
    POWER_UP_SHAPE: shapeFactory.createCircle(25),

    WORM_RADIUS: 3,
    WORM_SPEED: 80,
    WORM_TURNING_SPEED: 2.50,

    JUMP_COOLDOWN: 1.5,                // After a jump, this is the minimum waiting time until another jump
    JUMP_LENGTH: 30,                        // The length of a jump
    JUMP_CHANCE: 0.4,                       // 0.5 means 50 % chance of jump after 1 second has passed (after the JUMP_COOLDOWN has passed).

    STEERING_STRAIGHT: 0,
    STEERING_LEFT: -1,
    STEERING_RIGHT: 1,

    PLAY_AREA_FREE: -1,
    PLAY_AREA_OBSTACLE: -2
};