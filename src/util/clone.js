module.exports = function clone(source) {
    var clonedObject = {};

    for (var prop in source) {
        if (source.hasOwnProperty(prop)) {
            clonedObject[prop] = source[prop];
        }
    }

    return clonedObject;
};