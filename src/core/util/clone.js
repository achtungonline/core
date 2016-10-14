function isPrimitive(object) {
    return typeof object !== "object" ||  object === null || object === undefined
}

export default function clone(source) {

    if (Array.isArray(source)) {
        var clonedArray = [];
        source.forEach(function (item) {
            if (isPrimitive(item)) {
                clonedArray.push(item);
            } else {
                clonedArray.push(clone(item));
            }
        });
        return clonedArray;
    } else {
        var clonedObject = {};
        for (var prop in source) {
            if (source.hasOwnProperty(prop)) {
                var value = source[prop];
                if (isPrimitive(value)){
                    clonedObject[prop] = value;
                } else {
                    clonedObject[prop] = clone(value);
                }
            }
        }

        return clonedObject;
    }
};