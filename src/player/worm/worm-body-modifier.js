module.exports = function WormBodyModifier(wormBodyGridHandler, wormBodyImmunityHandler) {

    function pushBodyPart(worm, bodyPart) {
        worm.body.push(bodyPart);
        wormBodyGridHandler.addBodyPart(worm, bodyPart);
        wormBodyImmunityHandler.addBodyPart(worm, bodyPart);
    }

    function removeBodyPart(worm, bodyPart) {
        for (var i = 0; i < worm.body.length; i++) {
            if (worm.body[i] == bodyPart) {
                worm.body.splice(i, 1);
                wormBodyGridHandler.removeBodyPart(worm, bodyPart);
                return;
            }
        }
    }

    return {
        pushBodyPart: pushBodyPart,
        removeBodyPart: removeBodyPart
    }
}