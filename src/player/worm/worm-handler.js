var EventEmitter = require("events").EventEmitter;

module.exports = function WormHandler(playAreaHandler, collisionHandler, shapeModifierI, wormBodyImmunityHandler, clone, bodyPartDecider) {
    var eventEmitter = new EventEmitter();
    var events = {};

    events.WORM_DIED = "wormDied";

    collisionHandler.on(collisionHandler.events.WORM_MAP_COLLISION, function onWormMapCollision(gameState, player, worm) {
        if (worm.alive) {
            kill(gameState, player, worm);
        }
    });

    collisionHandler.on(collisionHandler.events.WORM_WORM_COLLISION, function onWormWormCollision(gameState, player, worm, otherWormID) {
        if (worm.alive) {
            kill(gameState, player, worm);
        }
    });

    function kill(gameState, player, worm) {
        if (!worm.alive) {
            throw Error("Trying to kill worm that is already dead");
        }
        worm.alive = false;
        eventEmitter.emit(events.WORM_DIED, gameState, player, worm);
    }

    function pushBodyPart(gameState, worm) {
        var changedCells = playAreaHandler.applyWormHead(gameState, worm);
        wormBodyImmunityHandler.setImmunityCells(worm, changedCells);
    }

    function update(gameState, deltaTime, player, worm) {
        function updateDirection() {
            var direction = worm.direction + player.steering * worm.turningSpeed * deltaTime;
            setDirection(worm, direction);
        }

        function updateBody() {
            var bodyPart = clone(worm.head);
            if (worm.speed) { // Never jump when standing still
                bodyPart = bodyPartDecider.decide(deltaTime, worm, bodyPart);
            }
            if (!bodyPart) {
                return;
            }
            pushBodyPart(gameState, worm, bodyPart);
            return bodyPart;
        }

        function updatePosition() {
            var xDiff = Math.cos(worm.direction) * worm.speed * deltaTime;
            var yDiff = Math.sin(worm.direction) * worm.speed * deltaTime;

            setHead(worm, shapeModifierI.move(worm.head, xDiff, yDiff));
            wormBodyImmunityHandler.update(worm);
        }

        function collisionDetection() {
            collisionHandler.wormMapCollisionDetection(gameState, player, worm);
            collisionHandler.wormWormCollisionDetection(gameState, player, worm);
        }

        updateBody();
        updateDirection();
        updatePosition();
        collisionDetection()
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
        on: eventEmitter.on.bind(eventEmitter),
        events: events
    }
};

