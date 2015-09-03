var circleType = require("./shape/circle.js").type;
var rectType = require("./shape/rectangle.js").type;

var spatialRelations = module.exports = {};

var intersectsFunctions = getIntersectsFunctions();
var containsFunctions = getContainsFunctions();

spatialRelations.intersects = function intersects(shape, otherShape) {
    return isRelationTrue(intersectsFunctions, shape, otherShape);
};

spatialRelations.contains = function contains(outerShape, innerShape) {
    return isRelationTrue(containsFunctions, outerShape, innerShape);
};

spatialRelations.distanceSquared = function distance(shape, otherShape) {
    var dist = getXYDist(shape, otherShape);
    return dist.x * dist.x + dist.y * dist.y;
};

function isRelationTrue(spatialRelationsFunctions, shape, otherShape) {
    var selectedFunction;

    if (spatialRelationsFunctions[shape.type] && spatialRelationsFunctions[shape.type][otherShape.type]) {
        selectedFunction = spatialRelationsFunctions[shape.type][otherShape.type].bind(null, shape, otherShape);
    } else if (spatialRelationsFunctions[otherShape.type] && spatialRelationsFunctions[otherShape.type][shape.type]) {
        selectedFunction = spatialRelationsFunctions[otherShape.type][shape.type].bind(null, otherShape, shape);
    }

    if (!selectedFunction) {
        throw Error("No spatial relation function found between shapes: " + shape.type + " and " + otherShape.type);
    }

    return selectedFunction();
}

function getIntersectsFunctions() {
    var functions = {};

    var set = setFunction.bind(null, functions);

    set(circleType, circleType, function (circle, otherCircle) {
        if (!boundingBoxesIntersects(circle, otherCircle)) {
            return false;
        }

        var maxAllowedDist = circle.radius + otherCircle.radius;

        return spatialRelations.distanceSquared(circle, otherCircle) < maxAllowedDist * maxAllowedDist;
    });

    set(rectType, rectType, function (rect, otherRect) {
        return boundingBoxesIntersects(rect, otherRect);
    });

    set(circleType, rectType, function (circle, rect) {
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
        var cornerDistanceSq = Math.pow(dist.x - rect.width / 2, 2) + Math.pow(dist.y - rect.height / 2, 2);

        return cornerDistanceSq <= Math.pow(circle.radius, 2);
    });

    return functions;
}

function getContainsFunctions() {
    var functions = {};

    var set = setFunction.bind(null, functions);

    set(circleType, circleType, function (outerCircle, innerCircle) {
        if (!boundingBoxesContains(outerCircle, innerCircle)) {
            return false;
        }

        var maxAllowedDist = outerCircle.radius - innerCircle.radius;

        return spatialRelations.distanceSquared(outerCircle, innerCircle) < maxAllowedDist * maxAllowedDist;
    });

    set(rectType, rectType, function (outerRect, innerRect) {
        return boundingBoxesContains(outerRect, innerRect);
    });

    set(circleType, rectType, function (outerCircle, innerRect) {
        if (!boundingBoxesContains(outerCircle, innerRect)) {
            return false;
        }

        var rectOnRight = (innerRect.x > outerCircle.x ? 1 : -1);
        var rectOnTop = (innerRect.y > outerCircle.y ? 1 : -1);

        var dist = getXYDist(outerCircle, innerRect);

        //here we select the rectangles corner point furthest away from the circle center
        dist.x += rectOnRight * innerRect.width / 2;
        dist.y += rectOnTop * innerRect.height / 2;

        return Math.pow(outerCircle.radius, 2) < Math.pow(dist.x, 2) + Math.pow(dist.y, 2);
    });

    set(rectType, circleType, function (outerRect, innerCircle) {
        return boundingBoxesContains(outerRect, innerCircle);
    });

    return functions;
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

function boundingBoxesContains(outerShape, innerShape) {
    var dist = getXYDist(outerShape, innerShape);

    dist.x += innerShape.boundingBox.width / 2;
    dist.y += innerShape.boundingBox.height / 2;

    if (dist.x < outerShape.boundingBox.width / 2 && dist.y < outerShape.boundingBox.height / 2) {
        return true;
    } else {
        return false;
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