module.exports = function Map(shape, blockingShapes) {
    if (!blockingShapes) {
        blockingShapes = [];
    }
    var map = {};
    map.shape = shape;
    map.blockingShapes = blockingShapes;
    return map;
};