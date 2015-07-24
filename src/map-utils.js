var utils = module.exports = {};

utils.getBoundingBox = function (map) {
    var boundingBox = {
        width: 0,
        height: 0
    };

    map.shapes.forEach(function (shape) {
        if (shape.x + shape.boundingBox.width > boundingBox.width) {
            boundingBox.width = shape.x + shape.boundingBox.width;
        }

        if (shape.y + shape.boundingBox.height > boundingBox.height) {
            boundingBox.height = shape.y + shape.boundingBox.height;
        }
    });

    return boundingBox;
};

utils.isInsidePlayableArea = function (map, shape) {
    //TODO: This needs to be done better.

    var mapX = map.shapes[0].x;
    var mapY = map.shapes[0].y;
    var mapBoundingBox = utils.getBoundingBox(map);

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
