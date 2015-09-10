var seedrandom = require("seedrandom");

module.exports = function Random(seed) {

    seed = seed || Math.seedrandom();
    var random = seedrandom(seed);

    function setSeed(seed) {
        random = seedrandom(seed);
    }

    function getSeed() {
        return seed;
    }

    function randInt(low, high) {
        return Math.floor(random() * (high - low) + low);
    }

    function randomElement(list) {
        return list[randInt(0, list.length)];
    }

    return {
        setSeed: setSeed,
        getSeed: getSeed,
        random: random,
        randInt: randInt,
        randomElement: randomElement
    };
};