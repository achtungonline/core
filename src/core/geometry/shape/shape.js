/**
 * Represents the parameters for a generic shape.
 * @param type
 * @param boundingWidth
 * @param boundingHeight
 * @param x If undefined then no coordinate variables will be created
 * @param y If undefined then no coodinate variables will be created
 * @returns {{}}
 * @constructor
 */
module.exports = function Shape(type, boundingWidth, boundingHeight, x, y, area) {
    function setCoordinates(target, boundingBox, x, y) {
        target.x = x;
        target.y = y;
        target.maxX = x + boundingBox.width;
        target.maxY = y + boundingBox.height;
        target.centerX = x + boundingBox.width / 2;
        target.centerY = y + boundingBox.height / 2;
    }

    function createBoundingBox(width, height) {
        return {
            width: width,
            height: height
        };
    }

    function isDefined(value) {
        return value !== undefined && value !== null;
    }

    var shape = {};
    shape.type = type;
    shape.boundingBox = createBoundingBox(boundingWidth, boundingHeight);
    shape.area = area;

    if (isDefined(x) && isDefined(y)) {
        // only set the coordinate parameters if x and y are provided
        setCoordinates(shape, shape.boundingBox, x, y);
    }

    return shape;
};