var utils = module.exports = {};

utils.getBoundingBox = function(map) {
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