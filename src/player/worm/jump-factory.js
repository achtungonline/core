var Jump = require("./jump.js");
var timeBasedChance = require("./../../time-based-chance.js");

var JUMP_MIN_FREQUENCY = 2.5; // After a jump, this is the minimum waiting time until another jump
var JUMP_LENGTH = 0.4; // The length of a jump in seconds
var JUMP_CHANCE = 0.4; // 0.5 means 50 % chance of jump after 1 second has passed (after the JUMP_MIN_FREQUENCY has passed).

module.exports = function JumpFactory() {
    function create() {
        var timeBasedChanceCalculator = timeBasedChance.calculators.LinearTimeBasedChanceCalculator(JUMP_CHANCE);
        var timeBasedChanceTrigger = timeBasedChance.TimeBasedChanceTrigger(timeBasedChanceCalculator);
        return Jump(timeBasedChanceTrigger, JUMP_LENGTH, JUMP_MIN_FREQUENCY);
    }

    return {
        create: create
    }
};