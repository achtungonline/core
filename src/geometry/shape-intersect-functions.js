var circleType = require("./shape/circle.js").type;
var rectType = require("./shape/rectangle.js").type;

var shapeIFn = module.exports = {}

shapeIFn.getIntersectFunctionName = function (shapeType, otherShapeType) {
    var firstWord, secondWord;

    if (shapeType < otherShapeType) {
        firstWord = shapeType;
        secondWord = otherShapeType;
    } else {
        firstWord = otherShapeType;
        secondWord = shapeType;
    }
    return firstWord + "Intersects" + secondWord.charAt(0).toUpperCase() + secondWord.slice(1);
}

var getFnName = shapeIFn.getIntersectFunctionName;

shapeIFn[getFnName(circleType, circleType)] = function (circle, otherCircle) {
    if (!boundingBoxesIntersects(circle, otherCircle)) {
        return false;
    }
    var minAllowedDist = circle.radius + otherCircle.radius;

    var dist = getXYDist(circle, otherCircle);
    return Math.pow(dist.x, 2) + Math.pow(dist.y, 2) < Math.pow(minAllowedDist, 2);
}

shapeIFn[getFnName(rectType, rectType)] = function (rect, otherRect) {
    return boundingBoxesIntersects(rect, otherRect);
}

shapeIFn[getFnName(circleType, rectType)] = function (shape, otherShape) {
    if (!boundingBoxesIntersects(shape, otherShape)) {
        return false;
    }
    var circle, rect;
    if (shape.type === circleType) {
        circle = shape;
        rect = otherShape;
    } else {
        circle = otherShape;
        rect = shape;
    }

    var dist = getXYDist(circle, rect);

    //The following 2 checks are only valid because of prior checking of the bounding boxes
    if (dist.x <= (rect.width / 2)) {
        return true;
    }
    if (dist.y <= (rect.height / 2)) {
        return true;
    }

    // special case for rectangle corners
    cornerDistanceSq = Math.pow(dist.x - rect.width / 2, 2) + Math.pow(dist.y - rect.height / 2, 2);

    return cornerDistanceSq <= Math.pow(circle.radius, 2);
}


function boundingBoxesIntersects(shape, otherShape) {
    var dist = getXYDist(shape, otherShape);

    var minBoundingDistX = shape.boundingBox.width / 2 + otherShape.boundingBox.width / 2;
    var minBoundingDistY = shape.boundingBox.height / 2 + otherShape.boundingBox.height / 2;

    if (dist.x > minBoundingDistX || dist.y > minBoundingDistY) {
        // If bounding box does not intersect, we know the shapes do not intersect
        return false
    } else {
        // More intersect checking is needed
        return true;
    }
}


function getXYDist(shape, otherShape) {
    var dist = {};
    dist.x = Math.abs(shape.centerX - otherShape.centerX);
    dist.y = Math.abs(shape.centerY - otherShape.centerY);
    return dist;
}
