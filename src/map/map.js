module.exports = function Map(zones) {

    function createBoundingBox() {
        var minX, maxX, minY, maxY;
        zones.forEach(function (zone) {
            if (zone.blocking) {
                return;
            }
            var shape = zone.shape;
            if (!minX || shape.x < minX) {
                minX = shape.x;
            }
            if (!minY || shape.y < minY) {
                minY = shape.y;
            }
            if (!maxX || shape.maxX > maxX) {
                maxX = shape.maxX;
            }
            if (!maxY || shape.maxY < minY) {
                maxY = shape.maxY;
            }
        });

        var boundingBox = {};
        boundingBox.width = maxX - minX;
        boundingBox.height = maxY - minY;

        return boundingBox;
    };

    var map = {};

    map.zones = zones;
    map.boundingBox = createBoundingBox();
    return map;
};