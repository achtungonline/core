var timeBasedChance = module.exports = {};


/**
 * Uses a time based chance calculator and at each call to update, there is a chance that that the given callback will be triggered.
 * When triggered the chanceCalculator is reseted.
 *
 * @param timeBasedChanceCalculator
 */
timeBasedChance.TimeBasedChanceTrigger = function TimeBasedChanceTrigger(timeBasedChanceCalculator) {

    function update(deltaTime, totalTime, callback) {
        timeBasedChanceCalculator.update(deltaTime, totalTime);
        var chance = timeBasedChanceCalculator.getCurrentChance();
        if (chance >= Math.random()) {
            timeBasedChanceCalculator.reset();
            callback();
        }
    }

    return {
        update: update
    }
};

timeBasedChance.calculators = {};

/**
 * Exponential and uses pow on doubles (expensive).
 * Goes towards 100% chance.
 * 1 second passed = baseChance. When time goes to infinity, chance goes towards 100%.
 * (1 - baseChance^time) = chance
 */
timeBasedChance.calculators.ExpoTimeBasedChanceCalculator = function expoTimeBaseChanceCalculator(baseChance) {
    var currentChance = 0;

    function update(deltaTime, totalTime) {
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
    }
};

/**
 * Linear and cheaper calculations.
 * Guarantees to reach 100% at some point in time
 * 1 second passed = baseChance. When 1/baseChance time has passed, chance becomes 100%
 * (time * baseChance)  = chance
 */
timeBasedChance.calculators.LinearTimeBasedChanceCalculator = function LinearTimeBasedChanceCalculator(baseChance) {
    var accumulatedNotChance;
    var currentChance;

    reset();

    function update(deltaTime, totalTime) {
        var totalChance = baseChance * totalTime;
        var totalNotChance = 1 - totalChance;
        var chanceNotThisUpdate = (totalNotChance === 0 ? 0 : totalNotChance / accumulatedNotChance); // Make sure we don't divide by 0
        var chanceThisUpdate = 1 - chanceNotThisUpdate;
        accumulatedNotChance = accumulatedNotChance * chanceNotThisUpdate;

        currentChance = chanceThisUpdate;
    }

    function getCurrentChance() {
        return currentChance;
    }

    function reset() {
        //Always begin with 0 % currentChance at time 0 and 0 % accumulated chance (or 100% accumulatedNotChance)
        accumulatedNotChance = 1;
        currentChance = 0;
    }

    return {
        update: update,
        getCurrentChance: getCurrentChance,
        reset: reset
    }
};