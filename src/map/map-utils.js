var shapeSpatialRelations = require("./../geometry/shape-spatial-relations.js");
var utils = module.exports = {};

utils.isInsidePlayableArea = function (map, shape) {
    if (!shapeSpatialRelations.contains(map.shape, shape)) {
        return false;
    }

    for (var i = 0; i < map.blockingShapes.length; i++) {
        if (shapeSpatialRelations.intersects(map.blockingShapes[i], shape)) {
            return false;
        }
    }

    return true;
};
