var shapeFactory = require("./geometry/shape-factory.js");

var powerUpDefinitions = {};
powerUpDefinitions["speed"] = {
    name: "speed",
    effectType: "speed",
    effectDuration: 5,
    effectStrength: 3 / 2,
    weightedSpawnChance: 1,
    affects: "self"
};
powerUpDefinitions["slow"] = {
    name: "slow",
    effectType: "speed",
    effectDuration: 5,
    effectStrength: 2 / 3,
    weightedSpawnChance: 1,
    affects: "others"
};
powerUpDefinitions["fat"] = {
    name: "fat",
    effectType: "size",
    effectDuration: 5,
    effectStrength: 2,
    weightedSpawnChance: 1,
    affects: "others"
};
powerUpDefinitions["slim"] = {
    name: "slim",
    effectType: "size",
    effectDuration: 5,
    effectStrength: 0.5,
    weightedSpawnChance: 1,
    affects: "self"
};
powerUpDefinitions["quick_turn"] = {
    name: "quick_turn",
    effectType: "turningSpeed",
    effectDuration: 5,
    effectStrength: 3 / 2,
    weightedSpawnChance: 1,
    affects: "self"
};
powerUpDefinitions["slow_turn"] = {
    name: "slow_turn",
    effectType: "turningSpeed",
    effectDuration: 5,
    effectStrength: 2 / 3,
    weightedSpawnChance: 1,
    affects: "others"
};
powerUpDefinitions["switcharoonie"] = {
    name: "switcharoonie",
    effectType: "wormSwitch",
    weightedSpawnChance: 0.5,
    affects: "all"
};
powerUpDefinitions["key_switch"] = {
    name: "key_switch",
    effectType: "turningSpeed",
    effectDuration: 5,
    effectStrength: -1,
    weightedSpawnChance: 1,
    affects: "others"
};
powerUpDefinitions["drunk"] = {
    name: "drunk",
    effectType: "drunk",
    effectDuration: 5,
    effectStrength: 1,
    weightedSpawnChance: 1,
    affects: "others"
};
powerUpDefinitions["clear_all"] = {
    name: "clear",
    effectType: "clear",
    weightedSpawnChance: 0.25,
    affects: "all"
};
powerUpDefinitions["clear_self"] = {
    name: "clear",
    effectType: "clear",
    weightedSpawnChance: 0.25,
    affects: "self"
};
powerUpDefinitions["clear_others"] = {
    name: "clear",
    effectType: "clear",
    weightedSpawnChance: 0.25,
    affects: "others"
};
powerUpDefinitions["super_jump"] = {
    name: "super_jump",
    effectType: "superJump",
    effectDuration: 5,
    weightedSpawnChance: 1,
    affects: "self"
};
powerUpDefinitions["tron_turn"] = {
    name: "tron_turn",
    effectType: "tronTurn",
    effectDuration: 5,
    weightedSpawnChance: 1,
    affects: "others"
};
powerUpDefinitions["twin"] = {
    name: "twin",
    effectType: "twin",
    effectDuration: 5,
    weightedSpawnChance: 1,
    affects: "self"
};

module.exports = {
    START_PHASE_DURATION: 2.5,
    START_DISTANCE_TO_MAP: 50,
    START_DISTANCE_TO_WORMS: 70,

    powerUpDefinitions: powerUpDefinitions,
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