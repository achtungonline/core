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
function createShape(type, boundingWidth, boundingHeight, x, y, area) {
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
}

function createCircle(radius, x, y) {
    var area = Math.PI * radius * radius;
    var shape = createShape("circle", radius * 2, radius * 2, x, y, area);
    shape.radius = radius;
    return shape;
}

function createRectangle(width, height, x, y) {
    var area = width * height;
    var shape = createShape("rectangle", width, height, x, y, area);

    shape.width = width;
    shape.height = height;
    return shape;
}

function createSquare(size, x, y) {
    return createRectangle(size, size, x, y);
}

export {
    createCircle,
    createRectangle,
    createSquare
};
