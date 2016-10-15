import * as shapeFactory from "./geometry/shape-factory.js";
import forEach from "./util/for-each.js";

var wormColors = {
    blue: "#03A9F4",
    pink: "#E91E63",
    green: "#4CAF50",
    purple: "#9C27B0",
    orange: "#FF9800",
    lime: "#CDDC39",
    indigo: "#3F51B5",
    teal: "#009688",
    black: "#444",
    bluegrey: "#607D8B"
};
var wormColorIds = [];
forEach(wormColors, (color, id) => wormColorIds.push(id));

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
    weightedSpawnChance: 1000.5,
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
    weightedSpawnChance: 1000.25,
    affects: "self"
};
powerUpDefinitions["clear_others"] = {
    name: "clear",
    effectType: "clear",
    weightedSpawnChance: 1000.25,
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
    weightedSpawnChance: 1000,
    affects: "self"
};

powerUpDefinitions["wall_hack_self"] = {
    name: "wall_hack",
    effectType: "wallHack",
    effectDuration: 5,
    weightedSpawnChance: 0.5,
    affects: "self"
};

powerUpDefinitions["wall_hack_all"] = {
    name: "wall_hack",
    effectType: "wallHack",
    effectDuration: 5,
    weightedSpawnChance: 1000.5,
    affects: "all"
};

var START_PHASE_DURATION = 2.5;
var START_DISTANCE_TO_MAP = 50;
var START_DISTANCE_TO_WORMS = 70;

var POWER_UP_SPAWN_CHANCE = 0.5; //0.12;            // Inverse of maximum time between power up spawns (seconds). 0.1 means max 10 seconds; average 5 seconds.
var POWER_UP_SHAPE = shapeFactory.createCircle(25);

var WORM_RADIUS = 4;
var WORM_SPEED = 90;
var WORM_TURNING_SPEED = 3;

var JUMP_COOLDOWN = 1.5;                // After a jump; this is the minimum waiting time until another jump
var JUMP_LENGTH = 30;                   // The length of a jump
var JUMP_CHANCE = 0.4;                  // 0.5 means 50 % chance of jump after 1 second has passed (after the JUMP_COOLDOWN has passed).

var IMMUNITY_DISTANCE_MULTIPLIER = 6;

var STEERING_STRAIGHT = 0;
var STEERING_LEFT = -1;
var STEERING_RIGHT = 1;

var PLAY_AREA_FREE = -1;
var PLAY_AREA_OBSTACLE = -2;

export {
    START_PHASE_DURATION,
    START_DISTANCE_TO_MAP,
    START_DISTANCE_TO_WORMS,
    wormColors,
    wormColorIds,
    powerUpDefinitions,
    POWER_UP_SPAWN_CHANCE,
    POWER_UP_SHAPE,

    WORM_RADIUS,
    WORM_SPEED,
    WORM_TURNING_SPEED,

    JUMP_COOLDOWN,
    JUMP_LENGTH,
    JUMP_CHANCE,

    IMMUNITY_DISTANCE_MULTIPLIER,

    STEERING_STRAIGHT,
    STEERING_LEFT,
    STEERING_RIGHT,

    PLAY_AREA_FREE,
    PLAY_AREA_OBSTACLE,
}