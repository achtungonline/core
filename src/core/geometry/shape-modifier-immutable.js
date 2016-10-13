import * as shapeFactory from "./shape-factory.js";

var setSizeFunctions = {};
setSizeFunctions["circle"] = function setCircleSize(circle, newDiameter) {
    var newRadius = newDiameter / 2;
    var radiusDiff = newRadius - circle.radius;
    if (newRadius < 0) {
        throw Error("Changing size of a circle from size: " + circle.radius + " to: " + newRadius);
    }
    return shapeFactory.createCircle(newRadius, circle.x - radiusDiff, circle.y - radiusDiff);
};
setSizeFunctions["rectangle"] = function setRectSize(rect, newWidth, newHeight) {
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

var setPositionFunctions = {};
setPositionFunctions["circle"] = function setCirclePosition(circle, x, y) {
    return shapeFactory.createCircle(circle.radius, x, y);
};
setPositionFunctions["rectangle"] = function setRectPosition(rect, x, y) {
    return shapeFactory.createRectangle(rect.width, rect.height, x, y);
};

function changeSize(shape, boundingBoxWidthDiff, boundingBoxHeightDiff) {
    var changeSizeFunction = setSizeFunctions[shape.type];
    return changeSizeFunction(shape, shape.boundingBox.width + boundingBoxWidthDiff, shape.boundingBox.height + boundingBoxHeightDiff);
}

function move(shape, xDiff, yDiff) {
    var x = shape.x += xDiff;
    var y = shape.y += yDiff;
    return setPosition(shape, x, y);
}

function setPosition(shape, x, y) {
    var setPositionFunction = setPositionFunctions[shape.type];
    return setPositionFunction(shape, x, y);
}

function setSize(shape, boundingBoxWidth, boundingBoxHeight) {
    var changeSizeFunction = setSizeFunctions[shape.type];
    return changeSizeFunction(shape, boundingBoxWidth, boundingBoxHeight);
}

export {
    changeSize,
    move,
    setPosition,
    setSize
};