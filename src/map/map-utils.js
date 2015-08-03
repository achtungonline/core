var shapeSpatialRelations = require("./../geometry/shape-spatial-relations.js");
var clone = require("./../util/clone.js");

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

//TODO: Shoule be moved and probably remade a bit
utils.getRandomPositionInsidePlayableArea = function (clone, shapeModifier, map, shape) {
    var pos = {};
    var i = 0;
    while (i < 100000) {
        pos.x = Math.random() * map.width;
        pos.y = Math.random() * map.height;
        var tempShape = clone(shape);
        shapeModifier.setPosition(tempShape, pos.x, pos.y);
        if (utils.isInsidePlayableArea(map, tempShape)) {
            return pos;
        }
        i++;
    }
    throw Error("Failed to find a position inside playable area for the given shape");
}
