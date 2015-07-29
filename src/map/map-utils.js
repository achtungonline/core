var shapeSpatialRelations = require("./../geometry/shape-spatial-relations.js");
var utils = module.exports = {};

utils.isInsidePlayableArea = function (map, shape) {
    if (!shapeSpatialRelations.contains(map.shape, shape)) {
        return false;
    }

    map.blockingShapes.forEach(function (blockingShape) {
        if (shapeSpatialRelations.intersects(blockingShape, shape)) {
            return false;
        }
    });
    return true;
};
