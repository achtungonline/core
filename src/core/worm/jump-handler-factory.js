var JumpHandler = require("./jump-handler.js");
var timeBasedChance = require("../time-based-chance.js");

var JUMP_MIN_FREQUENCY = 1.5; // After a jump, this is the minimum waiting time until another jump
var JUMP_LENGTH = 20; // The length of a jump
var JUMP_CHANCE = 0.4; // 0.5 means 50 % chance of jump after 1 second has passed (after the JUMP_MIN_FREQUENCY has passed).

module.exports = function JumpHandlerFactory(random) {
    function create() {
        var timeBasedChanceCalculator = timeBasedChance.calculators.LinearTimeBasedChanceCalculator(JUMP_CHANCE);
        var timeBasedChanceTrigger = timeBasedChance.TimeBasedChanceTrigger(timeBasedChanceCalculator, random);
        return JumpHandler(timeBasedChanceTrigger, JUMP_LENGTH, JUMP_MIN_FREQUENCY);
    }

    return {
        create: create
    };
};