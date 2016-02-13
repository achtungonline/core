var forEach = require("./for-each.js");

function random(gameState) {
    var x = Math.sin(gameState.seed++) * 10000;
    return x - Math.floor(x);
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

module.exports = {
    random: random,
    randInt: randInt,
    randomElementIndex: randomElementIndex,
    randomElement: randomElement,
    randomObjectProperty: randomObjectProperty,
    randomObjectValue: randomObjectValue,
    randomPermutation: randomPermutation
};
