var shapeSpatialRelations = require("./../geometry/shape-spatial-relations.js");
var shapeModifierI = require("./../geometry/shape-modifier-immutable-factory.js")().create();

var utils = module.exports = {};

utils.isInsideMap = function (map, shape) {
    return shapeSpatialRelations.contains(map.shape, shape);
};

utils.intersectsBlockingShapes = function (map, shape) {
    for (var i = 0; i < map.blockingShapes.length; i++) {
        if (shapeSpatialRelations.intersects(map.blockingShapes[i], shape)) {
            return true;
        }
    }
    return false;
};

utils.getRandomPositionInsidePlayableArea = function (map, shape) {
    var pos = {};
    var i = 0;
    var shapeWithNewPos = shape;
    while (i < 100000) {
        pos.x = Math.random() * map.width;
        pos.y = Math.random() * map.height;
        shapeWithNewPos = shapeModifierI.setPosition(shapeWithNewPos, pos.x, pos.y);
        if (utils.isInsideMap(map, shapeWithNewPos) && !utils.intersectsBlockingShapes(map, shapeWithNewPos)) {
            return pos;
        }
        i++;
    }
    throw Error("Failed to find a position inside playable area for the given shape");
};
