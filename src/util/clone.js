module.exports = function clone(source) {
    var clone = {};

    for (prop in source) {
        if (source.hasOwnProperty(prop)) {
            clone[prop] = source[prop];
        }
    }

    return clone;
};