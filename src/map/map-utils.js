var shapeSpatialRelations = require("./../geometry/shape-spatial-relations.js");
var shapeModifierI = require("./../geometry/shape-modifier-immutable-factory.js")().create();

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

utils.getRandomPositionInsidePlayableArea = function (map, shape) {
    var pos = {};
    var i = 0;
    var shapeWithNewPos = shape;
    while (i < 100000) {
        pos.x = Math.random() * map.width;
        pos.y = Math.random() * map.height;
        shapeWithNewPos = shapeModifierI.setPosition(shapeWithNewPos, pos.x, pos.y);
        if (utils.isInsidePlayableArea(map, shapeWithNewPos)) {
            return pos;
        }
        i++;
    }
    throw Error("Failed to find a position inside playable area for the given shape");
}
