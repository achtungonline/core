var utils = module.exports = {};

utils.isInsidePlayableArea = function (map, shape) {
    //TODO: This needs to be done better.

    var mapX = map.zones[0].shape.x;
    var mapY = map.zones[0].shape.y;
    var mapBoundingBox = map.boundingBox;

    if (shape.x + shape.boundingBox.width > mapX + mapBoundingBox.width) {
        return false;
    } else if (shape.x < mapX) {
        return false;
    } else if (shape.y < mapY) {
        return false;
    } else if (shape.y + shape.boundingBox.height > mapY + mapBoundingBox.height) {
        return false;
    }

    return true;
};
