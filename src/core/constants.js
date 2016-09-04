var shapeFactory = require("./geometry/shape-factory.js");
var speedEffectDefinition = require("./power-up/effect-definitions/speed.js");
var sizeEffectDefinition = require("./power-up/effect-definitions/size.js");
var turningSpeedEffectDefinition = require("./power-up/effect-definitions/turning-speed.js");
var wormSwitchEffectDefinition = require("./power-up/effect-definitions/worm-switch.js");
var drunkEffectDefinition = require("./power-up/effect-definitions/drunk.js");
var clearEffectDefinition = require("./power-up/effect-definitions/clear.js");
var superJumpEffectDefinition = require("./power-up/effect-definitions/super-jump.js");
var tronTurnEffectDefinition = require("./power-up/effect-definitions/tron-turn.js");
var twinEffectDefinition = require("./power-up/effect-definitions/twin.js");

var effectDefinitions = {};
effectDefinitions[speedEffectDefinition.type] = speedEffectDefinition;
effectDefinitions[sizeEffectDefinition.type] = sizeEffectDefinition;
effectDefinitions[turningSpeedEffectDefinition.type] = turningSpeedEffectDefinition;
effectDefinitions[wormSwitchEffectDefinition.type] = wormSwitchEffectDefinition;
effectDefinitions[drunkEffectDefinition.type] = drunkEffectDefinition;
effectDefinitions[clearEffectDefinition.type] = clearEffectDefinition;
effectDefinitions[superJumpEffectDefinition.type] = superJumpEffectDefinition;
effectDefinitions[tronTurnEffectDefinition.type] = tronTurnEffectDefinition;
effectDefinitions[twinEffectDefinition.type] = twinEffectDefinition;

var powerUpDefinitions = {};
powerUpDefinitions["speed"] = {
    name: "speed",
    effectType: speedEffectDefinition.type,
    effectDuration: 5,
    effectStrength: 3 / 2,
    weightedSpawnChance: 1,
    affects: "self"
};
powerUpDefinitions["slow"] = {
    name: "slow",
    effectType: speedEffectDefinition.type,
    effectDuration: 5,
    effectStrength: 2 / 3,
    weightedSpawnChance: 1,
    affects: "others"
};
powerUpDefinitions["fat"] = {
    name: "fat",
    effectType: sizeEffectDefinition.type,
    effectDuration: 5,
    effectStrength: 2,
    weightedSpawnChance: 1,
    affects: "others"
};
powerUpDefinitions["slim"] = {
    name: "slim",
    effectType: sizeEffectDefinition.type,
    effectDuration: 5,
    effectStrength: 0.5,
    weightedSpawnChance: 1,
    affects: "self"
};
powerUpDefinitions["quick_turn"] = {
    name: "quick_turn",
    effectType: turningSpeedEffectDefinition.type,
    effectDuration: 5,
    effectStrength: 3 / 2,
    weightedSpawnChance: 1,
    affects: "self"
};
powerUpDefinitions["slow_turn"] = {
    name: "slow_turn",
    effectType: turningSpeedEffectDefinition.type,
    effectDuration: 5,
    effectStrength: 2 / 3,
    weightedSpawnChance: 1,
    affects: "others"
};
powerUpDefinitions["switcharoonie"] = {
    name: "switcharoonie",
    effectType: wormSwitchEffectDefinition.type,
    weightedSpawnChance: 0.5,
    affects: "all"
};
powerUpDefinitions["key_switch"] = {
    name: "key_switch",
    effectType: turningSpeedEffectDefinition.type,
    effectDuration: 5,
    effectStrength: -1,
    weightedSpawnChance: 1,
    affects: "others"
};
powerUpDefinitions["drunk"] = {
    name: "drunk",
    effectType: drunkEffectDefinition.type,
    effectDuration: 5,
    effectStrength: 1,
    weightedSpawnChance: 1,
    affects: "others"
};
powerUpDefinitions["clear_all"] = {
    name: "clear",
    effectType: clearEffectDefinition.type,
    weightedSpawnChance: 0.25,
    affects: "all"
};
powerUpDefinitions["clear_self"] = {
    name: "clear",
    effectType: clearEffectDefinition.type,
    weightedSpawnChance: 0.25,
    affects: "self"
};
powerUpDefinitions["clear_others"] = {
    name: "clear",
    effectType: clearEffectDefinition.type,
    weightedSpawnChance: 0.25,
    affects: "others"
};
powerUpDefinitions["super_jump"] = {
    name: "super_jump",
    effectType: superJumpEffectDefinition.type,
    effectDuration: 5,
    weightedSpawnChance: 1,
    affects: "self"
};
powerUpDefinitions["tron_turn"] = {
    name: "tron_turn",
    effectType: tronTurnEffectDefinition.type,
    effectDuration: 5,
    weightedSpawnChance: 1,
    affects: "others"
};
powerUpDefinitions["twin"] = {
    name: "twin",
    effectType: twinEffectDefinition.type,
    effectDuration: 5,
    weightedSpawnChance: 1,
    affects: "self"
};

module.exports = {
    effectDefinitions: effectDefinitions,
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