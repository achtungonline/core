module.exports = function Random() {
    function randInt(low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    }

    function randomElement(list) {
        return list[randInt(0, list.length)];
    }

    return {
        randInt: randInt,
        randomElement: randomElement
    };
};