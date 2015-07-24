var circleType = require("./shape/circle.js").type;
var rectType = require("./shape/rectangle.js").type;

var spatialRelations = module.exports = {};

var intersectsFunctions = {};

spatialRelations.intersects = function intersects(shape, otherShape) {
    var intersectsFunction;

    if (intersectsFunctions[shape.type] && intersectsFunctions[shape.type][otherShape.type]) {
        intersectFunction = intersectsFunctions[shape.type][otherShape.type].bind(null, shape, otherShape);
    } else if (intersectsFunctions[otherShape.type] && intersectsFunctions[otherShape.type][shape.type]) {
        intersectsFunction = intersectsFunctions[otherShape.type][shape.type].bind(null, otherShape, shape);
    }

    if (!intersectFunction) {
        throw Error("No intersection function found between shapes: " + shape.type + " and " + otherShape.type);
    }

    return intersectFunction();
};

setFunction(intersectsFunctions, circleType, circleType, function (circle, otherCircle) {
    if (!boundingBoxesIntersects(circle, otherCircle)) {
        return false;
    }

    var minAllowedDist = circle.radius + otherCircle.radius;

    var dist = getXYDist(circle, otherCircle);
    return Math.pow(dist.x, 2) + Math.pow(dist.y, 2) < Math.pow(minAllowedDist, 2);
});

setFunction(intersectsFunctions, rectType, rectType, function (rect, otherRect) {
    return boundingBoxesIntersects(rect, otherRect);
});

setFunction(intersectsFunctions, circleType, rectType, function (circle, rect) {
    if (!boundingBoxesIntersects(circle, rect)) {
        return false;
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
});

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

function setFunction(map, firstLevel, secondLevel, fn) {
    if (!map[firstLevel]) {
        map[firstLevel] = {};
    }

    map[firstLevel][secondLevel] = fn;
}
