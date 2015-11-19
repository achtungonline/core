var idGenerator = module.exports = {};

idGenerator.indexCounterId = function (startingIndex) {
    return function nextIndexFunction() {
        var id = startingIndex;
        startingIndex++;
        return id;
    };
};

idGenerator.UUID = function () {
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};