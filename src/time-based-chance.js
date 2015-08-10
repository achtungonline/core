var timeBasedChance = module.exports = {};


/**
 * Uses a time based chance calculator and at each call to update, there is a chance that that the given callback will be triggered.
 * When triggered the chanceCalculator is reseted.
 *
 * @param timeBasedChanceCalculator
 */
timeBasedChance.TimeBasedChanceTrigger = function TimeBasedChanceTrigger(timeBasedChanceCalculator) {

    function update(deltaTime, callback) {
        timeBasedChanceCalculator.update(deltaTime);
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
 * (1 - (1 - baseChance)^time) = chance
 */
timeBasedChance.calculators.ExpoTimeBasedChanceCalculator = function expoTimeBaseChanceCalculator(baseChance) {
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
    }
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
<<<<<<< Updated upstream
        currentChance = deltaTime / (1 / baseChance - totalTime);
        totalTime += deltaTime;
=======

        var newWay = deltaTime / (1/baseChance - totalTime);

        console.log("New way: " + newWay);
        totalTime += deltaTime;
        var totalChance = baseChance * totalTime;
        var totalNotChance = 1 - totalChance;
        var chanceNotThisUpdate = (totalNotChance === 0 ? 0 : totalNotChance / accumulatedNotChance); // Make sure we don't divide by 0
        var chanceThisUpdate = 1 - chanceNotThisUpdate;
        accumulatedNotChance = accumulatedNotChance * chanceNotThisUpdate;

        currentChance = chanceThisUpdate;
        console.log("Old way: " + currentChance);
>>>>>>> Stashed changes
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
    }
};