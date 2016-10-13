export default function any(collection, fn) {
    for (var i = 0; i < collection.length; i++) {
        if (fn(collection[i])) {
            return true;
        }
    }

    return false;
};