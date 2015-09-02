var ShapeToGridConverter = require("./../../geometry/shape-to-grid-converter.js");
var forEach = require("./../../util/for-each.js");

module.exports = function WormBodyImmunityHandler() {
    var wormImmunityBodyParts = {};
    var shapeToGridConverter = ShapeToGridConverter.createShapeToGridConverter();

    var TTL = 3;

    function setImmunityBodyParts(playArea, worm, shape) {
        var bodyParts = wormImmunityBodyParts[worm.id];
        if (!bodyParts) {
            bodyParts = wormImmunityBodyParts[worm.id] = {};
        }
        shapeToGridConverter.convert(shape, playArea, ShapeToGridConverter.RoundingModes.TOUCHES).forEach(function (bodyPart) {
            bodyParts[bodyPart] = TTL;
        });
    }

    function isImmuneToBodyPart(worm, bodyPart) {
        var bodyParts = wormImmunityBodyParts[worm.id];
        return bodyParts && (bodyPart in bodyParts);
    }

    function update(worm) {
        var bodyParts = wormImmunityBodyParts[worm.id];
        if (!bodyParts) {
            return;
        }
        forEach(bodyParts, function (value, key) {
            if (!value) {
                delete bodyParts[key];
            } else {
                bodyParts[key]--;
            }
        });
    }

    return {
        setImmunityBodyParts: setImmunityBodyParts,
        isImmuneToBodyPart: isImmuneToBodyPart,
        update: update
    }
};