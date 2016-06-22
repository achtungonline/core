var EventEmitter = require("events").EventEmitter;
var playerUtils = require("../player/player-utils.js");
var gameStateFunctions = require("../game-state-functions.js");

module.exports = function WormHandler(playAreaHandler, collisionHandler, shapeModifierI, wormBodyImmunityHandler, clone, jumpHandler, effectHandler) {
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
        function updateHead() {
            var wormSize = gameStateFunctions.getWormSize(gameState, worm.id);
            worm.head = shapeModifierI.setSize(worm.head, wormSize, wormSize);
        }

        function updateDirection(turningSpeed) {
            var direction = worm.direction + turningSpeed * deltaTime;
            setDirection(worm, direction);
        }


        function updateBody() {
            var bodyPart = clone(worm.head);
            pushBodyPart(gameState, worm, bodyPart);
            return bodyPart;
        }

        function updatePosition(speed, turningSpeed) {
            var direction = gameStateFunctions.getWormDirection(gameState, worm.id);
            var xDiff = 0;
            var yDiff = 0;
            if (turningSpeed === 0) {
                // Straight line
                xDiff = deltaTime * speed * Math.cos(direction);
                yDiff = deltaTime * speed * Math.sin(direction);
            } else {
                // Circle arc
                var radius = speed / turningSpeed;
                var angle = deltaTime * turningSpeed;
                xDiff = -radius * (Math.cos(direction - Math.PI/2) + Math.cos(direction + Math.PI/2 + angle));
                yDiff = -radius * (Math.sin(direction - Math.PI/2) + Math.sin(direction + Math.PI/2 + angle));
            }

            setHead(worm, shapeModifierI.move(worm.head, xDiff, yDiff));
            wormBodyImmunityHandler.update(worm);
        }

        function collisionDetection() {

            collisionHandler.wormPowerUpCollisionDetection(gameState, worm);
            collisionHandler.wormMapCollisionDetection(gameState, worm);
            if (!gameStateFunctions.isWormJumping(gameState, worm.id)) {
                collisionHandler.wormWormCollisionDetection(gameState, worm);
            }
        }

        updateHead();
        jumpHandler.update(gameState, deltaTime, worm);
        
        var wormMoveUpdate = {
            type: "worm_moved",
            wormId: worm.id,
            speed: gameStateFunctions.getWormSpeed(gameState, worm.id),
            turningSpeed: playerUtils.getPlayerById(gameState.players, worm.playerId).steering * gameStateFunctions.getWormTurningSpeed(gameState, worm.id),
            jump: gameStateFunctions.isWormJumping(gameState, worm.id),
            deltaTime: deltaTime
        }
        if (gameState.phase === "startPhase") {
            wormMoveUpdate.speed = 0;
        }

        if (wormMoveUpdate.speed > 0 && !wormMoveUpdate.jump) {
            // No body update during the start phase and also only render the body if we are not standing still
            updateBody();
        }
        updatePosition(wormMoveUpdate.speed, wormMoveUpdate.turningSpeed);
        updateDirection(wormMoveUpdate.turningSpeed);
        collisionDetection();
        if (wormMoveUpdate.speed !== 0 || wormMoveUpdate.turningSpeed !== 0) {
            gameState.wormUpdateBuffer.push(wormMoveUpdate);
        }
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
        update: update,
        on: eventEmitter.on.bind(eventEmitter),
        events: events
    };
};
