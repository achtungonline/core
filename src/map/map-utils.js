var shapeSpatialRelations = require("./../geometry/shape-spatial-relations.js");
var utils = module.exports = {};

utils.isInsidePlayableArea = function (map, shape) {
    if (!shapeSpatialRelations.contains(map.shape, shape)) {
        return false;
    }

    for (var i in map.blockingShapes) {
        if (shapeSpatialRelations.intersects(map.blockingShapes[i], shape)) {
            return false;
        }
    }
    return true;
};
