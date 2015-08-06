module.exports = function WormBodyImmunityHandler(shapeSpatialRelations) {
    var wormImmunityBodyParts = {};

    function addBodyPart(worm, bodyPart) {
        if (!wormImmunityBodyParts[worm.id]) {
            wormImmunityBodyParts[worm.id] = [];
        }
        var bodyParts = wormImmunityBodyParts[worm.id];
        bodyParts.push(bodyPart);
    }

    function isImmuneBodyPart(worm, bodyPart) {
        var bodyParts = wormImmunityBodyParts[worm.id];
        return bodyParts && bodyParts.indexOf(bodyPart) !== -1;
    }

    function update(worm) {
        var bodyParts = wormImmunityBodyParts[worm.id];
        if (!bodyParts) {
            return;
        }
        bodyParts.forEach(function(bodyPart, index, list) {
            if (!shapeSpatialRelations.intersects(worm.head, bodyPart)) {
                list.splice(index, 1);
            }
        });
    }

    return {
        addBodyPart: addBodyPart,
        isImmuneBodyPart: isImmuneBodyPart,
        update: update
    }
}