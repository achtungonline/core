module.exports = function WormHandler(eventHandler, shapeModifierI, wormBodyGridHandler, wormBodyImmunityHandler, clone, bodyPartDecider) {

    eventHandler.on(eventHandler.events.WORM_MAP_COLLISION, function onWormMapCollision(players, player, worm) {
        if (worm.alive) {
            kill(players, player, worm);
        }
    });

    eventHandler.on(eventHandler.events.WORM_WORM_COLLISION, function onWormWormCollision(players, player, worm) {
        if (worm.alive) {
            kill(players, player, worm);
        }
    });

    function kill(players, player, worm) {
        if (!worm.alive) {
            throw Error("Trying to kill worm that is already dead");
        }
        worm.alive = false;
        eventHandler.emit(eventHandler.events.WORM_DIED, players, player, worm);
    }

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

    function update(deltaTime, player, worm) {
        function updateDirection() {
            var direction = worm.direction + player.steering * worm.turningSpeed * deltaTime;
            setDirection(worm, direction);
        }

        function updateBody() {
            var bodyPart = clone(worm.head);
            bodyPart = bodyPartDecider.decide(deltaTime, worm, bodyPart);
            if (!bodyPart) {
                return;
            }
            pushBodyPart(worm, bodyPart);
            return bodyPart;
        }

        function updatePosition() {
            var xDiff = Math.cos(worm.direction) * worm.speed * deltaTime;
            var yDiff = Math.sin(worm.direction) * worm.speed * deltaTime;

            setHead(worm, shapeModifierI.move(worm.head, xDiff, yDiff));
            wormBodyImmunityHandler.update(worm);
        }

        updateDirection();
        updateBody();
        updatePosition();
    }


    function setHead(worm, shape) {
        worm.head = shape;
    }

    function setDirection(worm, direction) {
        worm.direction = direction;
    }

    function setSpeed(worm, speed) {
        worm.speed = speed;
    }

    return {
        setSpeed: setSpeed,
        setDirection: setDirection,
        setHead: setHead,
        update: update,
        getBodyPartsInProximity: wormBodyGridHandler.getBodyPartsInProximity,
        isImmuneToBodyPart: wormBodyImmunityHandler.isImmuneToBodyPart
    }
};

