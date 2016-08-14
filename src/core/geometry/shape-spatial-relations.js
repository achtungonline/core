var spatialRelations = module.exports = {};

spatialRelations.intersects = function intersects(shape, otherShape) {
    return isRelationTrue(intersectsFunctions, shape, otherShape);
};

spatialRelations.contains = function contains(outerShape, innerShape) {
    return isRelationTrue(containmentFunctions, outerShape, innerShape);
};

spatialRelations.distanceSquared = function distance(shape, otherShape) {
    var dist = getXYDist(shape, otherShape);
    return dist.x * dist.x + dist.y * dist.y;
};

// -- INTERSECTION-FUNCTIONS --
var intersectsFunctions = createShapeRelationMatrix();

intersectsFunctions["circle"]["circle"] = function circleCircleIntersection(circle, otherCircle) {
    if (!boundingBoxesIntersects(circle, otherCircle)) {
        return false;
    }

    var maxAllowedDist = circle.radius + otherCircle.radius;

    return spatialRelations.distanceSquared(circle, otherCircle) < maxAllowedDist * maxAllowedDist;
};

intersectsFunctions["rectangle"]["rectangle"] = function rectangleRectangleIntersection(rectangle, otherRectangle) {
    return boundingBoxesIntersects(rectangle, otherRectangle);
};

intersectsFunctions["circle"]["rectangle"] = function circleRectangleIntersection(circle, rectangle) {
    if (!boundingBoxesIntersects(circle, rectangle)) {
        return false;
    }

    var dist = getXYDist(circle, rectangle);

    //The following 2 checks are only valid because of prior checking of the bounding boxes
    if (dist.x <= (rectangle.width / 2)) {
        return true;
    }
    if (dist.y <= (rectangle.height / 2)) {
        return true;
    }

    // special case for rectangle corners
    var cornerDistX = dist.x - rectangle.width / 2;
    var cornerDistY = dist.y - rectangle.height / 2;
    var cornerDistanceSq = cornerDistX*cornerDistX + cornerDistY*cornerDistY;

    return cornerDistanceSq <= circle.radius * circle.radius;
};

intersectsFunctions["rectangle"]["circle"] = function rectangleCircleIntersection(rectangle, circle) {
    return intersectsFunctions["circle"]["rectangle"](circle, rectangle);
};


// -- CONTAINMENT-FUNCTIONS
var containmentFunctions = createShapeRelationMatrix();

containmentFunctions["circle"]["circle"] = function circleCircleContainment(outerCircle, innerCircle) {
    if (!boundingBoxesContains(outerCircle, innerCircle)) {
        return false;
    }

    var maxAllowedDist = outerCircle.radius - innerCircle.radius;

    return spatialRelations.distanceSquared(outerCircle, innerCircle) < maxAllowedDist * maxAllowedDist;
};

containmentFunctions["rectangle"]["rectangle"] = function rectangleRectangleContainment(outerRectangle, innerRectangle) {
    return boundingBoxesContains(outerRectangle, innerRectangle);
};

containmentFunctions["circle"]["rectangle"] = function circleRectangleContainment(outerCircle, innerRectangle) {
    if (!boundingBoxesContains(outerCircle, innerRectangle)) {
        return false;
    }

    //here we select the rectangles corner point furthest away from the circle center
    var distX = Math.max(Math.abs(outerCircle.centerX - innerRectangle.x), Math.abs(outerCircle.centerX - innerRectangle.maxX));
    var distY = Math.max(Math.abs(outerCircle.centerY - innerRectangle.y), Math.abs(outerCircle.centerY - innerRectangle.maxY));

    return distX*distX + distY*distY <= outerCircle.radius*outerCircle.radius;
};

containmentFunctions["rectangle"]["circle"] = function rectangleCircleContainment(outerRectangle, innerCircle) {
    return boundingBoxesContains(outerRectangle, innerCircle);
};


// -- UTILITY-FUNCTIONS --
function isRelationTrue(spatialRelationsFunctions, shape, otherShape) {
    return spatialRelationsFunctions[shape.type][otherShape.type](shape, otherShape);
}

function boundingBoxesIntersects(shape, otherShape) {
    var dist = getXYDist(shape, otherShape);

    var minBoundingDistX = shape.boundingBox.width / 2 + otherShape.boundingBox.width / 2;
    var minBoundingDistY = shape.boundingBox.height / 2 + otherShape.boundingBox.height / 2;

    return !(dist.x > minBoundingDistX || dist.y > minBoundingDistY);
}

function boundingBoxesContains(outerShape, innerShape) {
    var dist = getXYDist(outerShape, innerShape);

    dist.x += innerShape.boundingBox.width / 2;
    dist.y += innerShape.boundingBox.height / 2;

    return dist.x < outerShape.boundingBox.width / 2 && dist.y < outerShape.boundingBox.height / 2;
}

function createShapeRelationMatrix() {
    var matrix = [];
    matrix["circle"] = [];
    matrix["rectangle"] = [];
    return matrix;
}

function getXYDist(shape, otherShape) {
    var dist = {};
    dist.x = Math.abs(shape.centerX - otherShape.centerX);
    dist.y = Math.abs(shape.centerY - otherShape.centerY);
    return dist;
}
