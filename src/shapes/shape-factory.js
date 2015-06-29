module.exports = function ShapeFactory() {
    function createShape(type, boundingWidth, boundingHeight) {
        return {
            type: type,
            boundingBox: createBoundingBox(boundingWidth, boundingHeight)
        };
    }

    function createBoundingBox(width, height) {
        return {
            width: width,
            height: height
        };
    }

    var createRectangleShape = createShape.bind(null, "rectangle");
    var createCircleShape = createShape.bind(null, "circle");

    function createRectangle(width, height) {
        var shape = createRectangleShape(width, height);
        shape.width = width;
        shape.height = height;
        return shape;
    }

    function createSquare(size) {
        return createRectangle(size, size);
    }

    function createCircle(radius) {
        var shape = createCircleShape(radius * 2, radius * 2);
        shape.radius = radius;
    }

    return {
        createRectangle: createRectangle,
        createSquare: createSquare,
        createCircle: createCircle
    };
};
