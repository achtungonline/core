module.exports = function Map(options) {
    var blockingShapes = options.blockingShapes;
    var shape = options.shape;
    var name = options.name;

    if (!blockingShapes) {
        blockingShapes = [];
    }
    var map = {};
    map.shape = options.shape;
    map.blockingShapes = blockingShapes;
    map.width = shape.boundingBox.width;
    map.height = shape.boundingBox.height;
    map.name = name;
    return map;
};