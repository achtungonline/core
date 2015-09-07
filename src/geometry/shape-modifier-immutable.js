var circleType = require("./shape/circle.js").type;
var rectType = require("./shape/rectangle.js").type;

module.exports = function ShapeModifierImmutable(shapeFactory) {

    var changeSizeFunctions = getChangeSizeFunctions();

    function getChangeSizeFunctions() {
        var functions = {};

        functions[circleType] = function changeCircleSize(circle, diameterDiff) {
            var radiusDiff = diameterDiff / 2;
            var newRadius = circle.radius + radiusDiff;
            if (newRadius < 0) {
                throw Error("Changing size of a circle from size: " + circle.radius + " to: " + newRadius);
            }
            return shapeFactory.createCircle(newRadius, circle.x - radiusDiff, circle.y - radiusDiff);
        };
        functions[rectType] = function changeRectSize(rect, widthDiff, heightDiff) {
            if (heightDiff === undefined) {
                heightDiff = widthDiff;
            }
            var newWidth = rect.width + widthDiff;
            var newHeight = rect.height + heightDiff;
            if (newWidth < 0 || newHeight < 0) {
                throw Error("Changing size of rectangle from w/h: " + rect.width + "/" + rect.height + "  to: " + newWidth + "/" + newHeight);
            }
            return shapeFactory.createRectangle(newWidth, newHeight, rect.x - widthDiff / 2, rect.y - heightDiff / 2);
        };

        return functions;
    }

    function changeSize(shape) {
        var changeSizeFunction = changeSizeFunctions[shape.type];
        return changeSizeFunction.apply(this, arguments);
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
        changeSize: changeSize
    };
};