module.exports = function forEach(collection, callback) {
    for (var k in collection) {
        if (collection.hasOwnProperty(k)) {
            callback(collection[k], k);
        }
    }
};