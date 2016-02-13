
var random = require("./util/random.js");
var timeBasedChance = module.exports = {};

/**
 * Uses a time based chance calculator and at each call to update, there is a chance that that the given callback will be triggered.
 * When triggered the chanceCalculator is reseted.
 *
 * @param timeBasedChanceCalculator
 */
timeBasedChance.TimeBasedChanceTrigger = function TimeBasedChanceTrigger(timeBasedChanceCalculator) {

    function update(gameState, deltaTime, callback) {

        timeBasedChanceCalculator.update(deltaTime);

        var chance = timeBasedChanceCalculator.getCurrentChance();
        if (chance >= random.random(gameState)) {
            timeBasedChanceCalculator.reset();
            callback();
        }
    }

    return {
        update: update
    };
};

timeBasedChance.calculators = {};

/**
 * Exponential and uses pow on doubles (expensive).
 * Goes towards 100% chance.
 * 1 second passed = baseChance. When time goes to infinity, chance goes towards 100%.
 * (1 - (1 - baseChance)^time) = chance
 */
timeBasedChance.calculators.ExpoTimeBasedChanceCalculator = function ExpoTimeBaseChanceCalculator(baseChance) {
    var currentChance = 0;

    function update(deltaTime) {
        currentChance = 1 - Math.pow(1 - baseChance, deltaTime);
    }

    function getCurrentChance() {
        return currentChance;
    }

    function reset() {
    }

    return {
        update: update,
        getCurrentChance: getCurrentChance,
        reset: reset
    };
};

/**
 * Linear and cheaper calculations.
 * Guarantees to reach 100% at some point in time
 * 1 second passed = baseChance. When 1/baseChance time has passed, chance becomes 100%
 * (time * baseChance)  = chance
 */
timeBasedChance.calculators.LinearTimeBasedChanceCalculator = function LinearTimeBasedChanceCalculator(baseChance) {
    var currentChance;
    var totalTime;

    reset();

    function update(deltaTime) {
        currentChance = deltaTime / (1 / baseChance - totalTime);
        totalTime += deltaTime;
    }


    function getCurrentChance() {
        return currentChance;
    }

    function reset() {
        currentChance = 0;
        totalTime = 0;
    }

    return {
        update: update,
        getCurrentChance: getCurrentChance,
        reset: reset
    };
};