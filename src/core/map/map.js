module.exports = function Map(shape, blockingShapes) {
    if (!blockingShapes) {
        blockingShapes = [];
    }
    var map = {};
    map.shape = shape;
    map.blockingShapes = blockingShapes;
    map.width = shape.boundingBox.width;
    map.height = shape.boundingBox.height;
    return map;
};