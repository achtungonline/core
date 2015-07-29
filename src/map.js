module.exports = function Map(shapes) {

    function createBoundingBox() {
        var boundingBox = {
            width: 0,
            height: 0
        };

        shapes.forEach(function (shape) {
            if (shape.x + shape.boundingBox.width > boundingBox.width) {
                boundingBox.width = shape.x + shape.boundingBox.width;
            }

            if (shape.y + shape.boundingBox.height > boundingBox.height) {
                boundingBox.height = shape.y + shape.boundingBox.height;
            }
        });

        return boundingBox;
    };

    var map = {};

    map.shapes = shapes;
    map.boundingBox = createBoundingBox();
    return map;
};