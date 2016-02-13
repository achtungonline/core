var circleType = require("./shape/circle.js").type;
var rectType = require("./shape/rectangle.js").type;

module.exports = function ShapeModifierImmutable(shapeFactory) {

    var setSizeFunctions = getSetSizeFunctions();

    function getSetSizeFunctions() {
        var functions = {};

        functions[circleType] = function setCircleSize(circle, newDiameter) {
            var newRadius = newDiameter / 2;
            var radiusDiff = newRadius - circle.radius;
            if (newRadius < 0) {
                throw Error("Changing size of a circle from size: " + circle.radius + " to: " + newRadius);
            }
            return shapeFactory.createCircle(newRadius, circle.x - radiusDiff, circle.y - radiusDiff);
        };
        functions[rectType] = function setRectSize(rect, newWidth, newHeight) {
            if (newHeight === undefined) {
                newHeight = newWidth;
            }
            var widthDiff = newWidth - rect.width;
            var heightDiff = newHeight - rect.height;
            if (newWidth < 0 || newHeight < 0) {
                throw Error("Changing size of rectangle from w/h: " + rect.width + "/" + rect.height + "  to: " + newWidth + "/" + newHeight);
            }
            return shapeFactory.createRectangle(newWidth, newHeight, rect.x - widthDiff / 2, rect.y - heightDiff / 2);
        };

        return functions;
    }

    function changeSize(shape, boundingBoxWidthDiff, boundingBoxHeightDiff) {
        var changeSizeFunction = setSizeFunctions[shape.type];
        return changeSizeFunction(shape, shape.boundingBox.width + boundingBoxWidthDiff, shape.boundingBox.height + boundingBoxHeightDiff);
    }

    function setSize(shape, boundingBoxWidth, boundingBoxHeight) {
        var changeSizeFunction = setSizeFunctions[shape.type];
        return changeSizeFunction(shape, boundingBoxWidth, boundingBoxHeight);
    }

    var setPositionFunctions = getSetPositionFunctions();

    function getSetPositionFunctions() {
        var functions = {};

        functions[circleType] = function setCirclePosition(circle, x, y) {
            return shapeFactory.createCircle(circle.radius, x, y);
        };

        functions[rectType] = function setRectPosition(rect, x, y) {
            return shapeFactory.createRectangle(rect.width, rect.height, x, y);
        };
        return functions;
    }

    function setPosition(shape, x, y) {
        var setPositionFunction = setPositionFunctions[shape.type];
        return setPositionFunction(shape, x, y);
    }

    function move(shape, xDiff, yDiff) {
        var x = shape.x += xDiff;
        var y = shape.y += yDiff;
        return setPosition(shape, x, y);
    }

    return {
        move: move,
        setPosition: setPosition,
        changeSize: changeSize,
        setSize: setSize
    };
};