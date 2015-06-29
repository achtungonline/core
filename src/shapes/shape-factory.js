module.exports = function ShapeFactory() {
    function createShape(type) {
        return {
            type: type
        };
    }

    var createRectangleShape = createShape.bind(null, "rectangle");
    var createCircleShape = createShape.bind(null, "circle");

    function createBoundingBox(width, height) {
        return {
            width: width,
            height: height
        };
    }

    function createRectangle (width, height) {
        var shape = createRectangleShape();
        shape.width = width;
        shape.height = height;
        shape.boundingBox = createBoundingBox(width, height);
        return shape;
    }

    function createSquare(size) {
        return createRectangle(size, size);
    }

    function createCircle(radius) {
        return {
            type: "circle",
            radius: radius,
            boundingBox: createBoundingBox(radius * 2, radius * 2)
        };
    }

    return {
        createRectangle: createRectangle,
        createSquare: createSquare,
        createCircle: createCircle
    };
};
