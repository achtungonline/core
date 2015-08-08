module.exports = function WormHandler(shapeModifierI, wormBodyGridHandler, wormBodyImmunityHandler, clone) {

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

    function updateBody(worm) {
        var bodyPart = clone(worm.head);
        pushBodyPart(worm, bodyPart);
        return bodyPart;
    }

    function updateDirection(deltaTime, player, worm) {
        var direction = worm.direction + player.steering * worm.turningSpeed * deltaTime;
        setDirection(worm, direction);
    }

    function updatePosition(deltaTime, worm) {
        var xDiff = Math.cos(worm.direction) * worm.speed * deltaTime;
        var yDiff = Math.sin(worm.direction) * worm.speed * deltaTime;

        setHead(worm, shapeModifierI.move(worm.head, xDiff, yDiff));
        wormBodyImmunityHandler.update(worm);
    }

    function setHead(worm, shape) {
        worm.head = shape;
    }

    function setDirection(worm, direction) {
        worm.direction = direction;
    }

    return {
        setDirection: setDirection,
        setHead: setHead,
        updateDirection: updateDirection,
        updatePosition: updatePosition,
        updateBody: updateBody,
        getBodyPartsInProximity: wormBodyGridHandler.getBodyPartsInProximity,
        isImmuneToBodyPart: wormBodyImmunityHandler.isImmuneToBodyPart
    }
};

