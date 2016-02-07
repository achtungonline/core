var forEach = require("./for-each.js");

module.exports = function Random(seed) {

    var currentSeed = seed || Math.random() + 1; //TODO: remove local state (ML)
    function random() {
        var x = Math.sin(currentSeed++) * 10000;
        return x - Math.floor(x);
    }

    function setSeed(seed) {
        currentSeed = seed;
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

    function randomPermutaion(n, avoidFixedPoints) {
        var elementsLeft = [];
        for (var i = 0; i < n; i++) {
            elementsLeft.push(i);
        }
        var res = new Array(n);
        for (i = 0; i < n; i++) {
            var index = randomElementIndex(elementsLeft);
            while (avoidFixedPoints && n > 1 && (elementsLeft[index] === i || i === n - 2 && elementsLeft[index^1] === n - 1)) {
                index = randomElementIndex(elementsLeft);
            }
            res[i] = elementsLeft.splice(index, 1)[0];
        }
        return res;

    }

    return {
        setSeed: setSeed,
        getSeed: getSeed,
        random: random,
        randInt: randInt,
        randomElementIndex: randomElementIndex,
        randomElement: randomElement,
        randomObjectProperty: randomObjectProperty,
        randomPermutation: randomPermutaion
    };
};