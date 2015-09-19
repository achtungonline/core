var seedrandom = require("seedrandom");
var forEach = require("./for-each.js");

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
    function randomElementIndex(list) {
        return randInt(0, list.length);
    }

    function randomElement(list) {
        return list[randomElementIndex(list)];
    }

    function randomObjectProperty(object) {
        var list = [];
        forEach(object, function(value, property) {
            list.push(property);
        });
        return randomElement(list);
    }

    return {
        setSeed: setSeed,
        getSeed: getSeed,
        random: random,
        randInt: randInt,
        randomElementIndex: randomElementIndex,
        randomElement: randomElement,
        randomObjectProperty: randomObjectProperty
    };
};