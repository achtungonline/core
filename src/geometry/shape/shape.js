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
    var shape = {};

    function setCoordinates(x, y) {
        shape.x = x;
        shape.y = y;
        shape.maxX = x + shape.boundingBox.width;
        shape.maxY = y + shape.boundingBox.height;
        shape.centerX = x + shape.boundingBox.width / 2;
        shape.centerY = y + shape.boundingBox.height / 2;
    }

    function createBoundingBox(width, height) {
        return {
            width: width,
            height: height
        };
    }

    shape.type = type;
    shape.boundingBox = createBoundingBox(boundingWidth, boundingHeight);
    shape.area = area;
    if (x !== undefined && y !== undefined) {
        // only set the coordinate parameters if x and y are provided
        setCoordinates(x, y);
    }

    return shape;
}