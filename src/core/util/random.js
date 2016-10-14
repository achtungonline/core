import forEach from "./for-each.js";
import MersenneTwister from "mersennetwister";

function toSignedInt32(x) {
    return x | 0;
}

/**
 * Generates a 32 bit seed by the current time.
 */
function generateSeed() {
    var seed = (new Date()).getTime();
    return toSignedInt32(seed);
}

function random(gameState) {
    function isInteger32(x) {
        return toSignedInt32(x) === x;
    }

    var seed = gameState.seed;

    if (!isInteger32(seed)) {
        throw new Error("Invalid seed found in game state. Must be a 32 bit integer. Actual seed: " + gameState.seed);
    }

    var generator = new MersenneTwister(seed);
    gameState.seed = toSignedInt32(generator.int());
    return generator.random();
}

function randInt(gameState, low, high) {
    return Math.floor(random(gameState) * (high - low) + low);
}

function randomElementIndex(gameState, list) {
    return randInt(gameState, 0, list.length);
}

function randomElement(gameState, list) {
    return list[randomElementIndex(gameState, list)];
}

function randomObjectProperty(gameState, object) {
    var list = [];
    forEach(object, function (value, property) {
        list.push(property);
    });
    return randomElement(gameState, list);
}

function randomObjectValue(gameState, object) {
    var list = [];
    forEach(object, function (value, property) {
        list.push(property);
    });
    return object[randomElement(gameState, list)];
}


function randomPermutation(gameState, n, avoidFixedPoints) {
    var elementsLeft = [];
    for (var i = 0; i < n; i++) {
        elementsLeft.push(i);
    }
    var res = new Array(n);
    for (i = 0; i < n; i++) {
        var index = randomElementIndex(gameState, elementsLeft);
        while (avoidFixedPoints && n > 1 && (elementsLeft[index] === i || i === n - 2 && elementsLeft[index ^ 1] === n - 1)) {
            index = randomElementIndex(gameState, elementsLeft);
        }
        res[i] = elementsLeft.splice(index, 1)[0];
    }
    return res;

}

export {
    generateSeed,
    random,
    randInt,
    randomElementIndex,
    randomElement,
    randomObjectProperty,
    randomObjectValue,
    randomPermutation
};
