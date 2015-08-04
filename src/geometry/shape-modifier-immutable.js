var circleType = require("./shape/circle.js").type;
var rectType = require("./shape/rectangle.js").type;

module.exports = function ShapeModifierImmutable(shapeFactory) {

    var changeSizeFunctions = {};

    changeSizeFunctions[circleType] = function (circle, diameterDiff) {
        var radiusDiff = diameterDiff / 2;
        var newRadius = circle.radius + radiusDiff;
        if (newRadius < 0) {
            throw Error("Changing size of a circle from size: " + circle.radius + " to: " + newRadius);
        }
        return shapeFactory.createCircle(newRadius, circle.x - radiusDiff, circle.y - radiusDiff);
    }
    changeSizeFunctions[rectType] = function (rect, widthDiff, heightDiff) {
        if(heightDiff === undefined) {
            heightDiff = widthDiff;
        }
        var newWidth = rect.width + widthDiff;
        var newHeight = rect.height + heightDiff;
        if (newWidth < 0 || newHeight < 0) {
            throw Error("Changing size of rectangle from w/h: " + rect.width + "/" + rect.height + "  to: " + newWidth + "/" + newHeight);
        }
        return shapeFactory.createRectangle(newWidth, newHeight, rect.x - widthDiff / 2, rect.y - heightDiff / 2);
    }

    function changeSize(shape) {
        var changeSizeFunction = changeSizeFunctions[shape.type];
        return changeSizeFunction.apply(this, arguments);
    }

    return {changeSize: changeSize}
}
