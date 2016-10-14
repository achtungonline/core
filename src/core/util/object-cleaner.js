function isPrimitive(object) {
    return typeof object !== "object" ||  object === null || object === undefined
}

function isToBeCleaned(object) {
    return object === undefined || object === null || (typeof object === "number" && isNaN(object));
}

export default function objectCleaner(source) {
    if (Array.isArray(source)) {
        var clonedArray = [];
        source.forEach(function (item) {
            if(!isToBeCleaned(item)) {
                if (isPrimitive(item)) {
                    clonedArray.push(item);
                } else {
                    clonedArray.push(objectCleaner(item));
                }
            }
        });
        return clonedArray;
    } else {
        var clonedObject = {};
        for (var prop in source) {
            if (source.hasOwnProperty(prop)) {
                var value = source[prop];
                if(!isToBeCleaned(value)) {
                    if (isPrimitive(value)) {
                        clonedObject[prop] = value;
                    } else {
                        clonedObject[prop] = objectCleaner(value);
                    }
                }
            }
        }

        return clonedObject;
    }
};