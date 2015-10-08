var EventEmitter = require("events").EventEmitter;
var playerUtils = require("../player-utils.js");

module.exports = function WormHandler(playAreaHandler, collisionHandler, shapeModifierI, wormBodyImmunityHandler, clone, jumpHandler) {
    var eventEmitter = new EventEmitter();
    var events = {};

    events.WORM_DIED = "wormDied";

    collisionHandler.on(collisionHandler.events.WORM_MAP_COLLISION, function onWormMapCollision(gameState, worm) {
        if (worm.alive) {
            kill(gameState, worm);
        }
    });

    collisionHandler.on(collisionHandler.events.WORM_WORM_COLLISION, function onWormWormCollision(gameState, worm, otherWormID) {
        if (worm.alive) {
            kill(gameState, worm);
        }
    });

    function kill(gameState, worm) {
        if (!worm.alive) {
            throw Error("Trying to kill worm that is already dead");
        }
        worm.alive = false;
        eventEmitter.emit(events.WORM_DIED, gameState, worm);
    }

    function pushBodyPart(gameState, worm) {
        var changedCells = playAreaHandler.applyWormHead(gameState, worm);
        wormBodyImmunityHandler.setImmunityCells(worm, changedCells);
    }

    function update(gameState, deltaTime, worm) {
        function updateDirection() {
            var direction = worm.direction + playerUtils.getPlayerById(gameState.players, worm.playerId).steering * worm.turningSpeed * deltaTime;
            setDirection(worm, direction);
        }

        function updateBody() {
            if (worm.speed <= 0 || jumpHandler.isJumping(worm)) {
                // Never jump when standing still
                return;
            }

            var bodyPart = clone(worm.head);
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

            collisionHandler.wormPowerUpCollisionDetection(gameState, worm);
            collisionHandler.wormMapCollisionDetection(gameState, worm);
            if (!jumpHandler.isJumping(worm)) {
                collisionHandler.wormWormCollisionDetection(gameState, worm);
            }
        }

        jumpHandler.update(deltaTime, worm);
        updateBody();
        updateDirection();
        updatePosition();
        collisionDetection();
    }


    function setHead(worm, shape) {
        worm.head = shape;
    }

    function setDirection(worm, direction) {
        worm.direction = direction;
    }

    function changeSize(worm, sizeChange) {
        setHead(worm, shapeModifierI.changeSize(worm.head, sizeChange));
    }

    function setSpeed(worm, speed) {
        worm.speed = speed;
    }

    function changeSpeed(worm, speedChange) {
        setSpeed(worm, worm.speed + speedChange);
    }

    return {
        setSpeed: setSpeed,
        changeSpeed: changeSpeed,
        changeSize: changeSize,
        setDirection: setDirection,
        setHead: setHead,
        update: update,
        on: eventEmitter.on.bind(eventEmitter),
        events: events
    };
};

