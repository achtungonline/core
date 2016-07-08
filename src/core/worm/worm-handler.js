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
        function updateHead(size) {
            worm.head = shapeModifierI.setSize(worm.head, size, size);
        }


        function updateBody() {
            var bodyPart = clone(worm.head);
            pushBodyPart(gameState, worm, bodyPart);
            return bodyPart;
        }

        function updatePosition(speed, turningVelocity, direction, pathSegment) {
            var xDiff = 0;
            var yDiff = 0;
            if (turningVelocity === 0) {
                // Straight line
                pathSegment.type = "straight";
                xDiff = deltaTime * speed * Math.cos(direction);
                yDiff = deltaTime * speed * Math.sin(direction);
            } else {
                // Circle arc
                pathSegment.type = "arc";
                var radius = speed / turningVelocity;
                var angle = deltaTime * turningVelocity;

                pathSegment.arcCenterX = pathSegment.startX - radius * Math.cos(direction - Math.PI/2);
                pathSegment.arcCenterY = pathSegment.startY - radius * Math.sin(direction - Math.PI/2);
                pathSegment.arcRadius = Math.abs(radius);
                pathSegment.arcStartAngle = direction - radius/Math.abs(radius)*Math.PI/2;
                pathSegment.arcAngleDiff = angle;
                pathSegment.arcEndAngle = pathSegment.arcStartAngle + pathSegment.arcAngleDiff;

                xDiff = -radius * (Math.cos(direction - Math.PI/2) + Math.cos(direction + Math.PI/2 + angle));
                yDiff = -radius * (Math.sin(direction - Math.PI/2) + Math.sin(direction + Math.PI/2 + angle));
            }
            pathSegment.endX = pathSegment.startX + xDiff;
            pathSegment.endY = pathSegment.startY + yDiff;
            pathSegment.endDirection = pathSegment.startDirection + turningVelocity * deltaTime;
            
            worm.direction += turningVelocity * deltaTime;
            worm.head = shapeModifierI.move(worm.head, xDiff, yDiff);
            wormBodyImmunityHandler.update(worm);
        }

        function collisionDetection() {

            collisionHandler.wormPowerUpCollisionDetection(gameState, worm);
            collisionHandler.wormMapCollisionDetection(gameState, worm);
            if (!gameStateFunctions.isWormJumping(gameState, worm.id)) {
                collisionHandler.wormWormCollisionDetection(gameState, worm);
            }
        }

        jumpHandler.update(gameState, deltaTime, worm);

        var steering = playerUtils.getPlayerById(gameState.players, worm.playerId).steering;
        var direction = gameStateFunctions.getWormDirection(gameState, worm.id);
        var speed = gameStateFunctions.getWormSpeed(gameState, worm.id);
        var size = gameStateFunctions.getWormSize(gameState, worm.id);
        var turningSpeed = gameStateFunctions.getWormTurningSpeed(gameState, worm.id);
        var turningVelocity = steering * turningSpeed;
        var jump = gameStateFunctions.isWormJumping(gameState, worm.id);
        if (gameState.phase === "startPhase") {
            speed = 0;
        }
        var pathSegment = {
            duration: deltaTime,
            startTime: gameState.gameTime - deltaTime,
            startX: worm.head.centerX,
            startY: worm.head.centerY,
            startDirection: worm.direction,
            jump: jump,
            size: size,
            speed: speed,
            turningVelocity: turningVelocity,
            playerId: worm.playerId
        }

        updateHead(size);
        if (speed > 0 && !jump) {
            // No body update during the start phase and also only render the body if we are not standing still
            updateBody();
        }
        updatePosition(speed, turningVelocity, direction, pathSegment);
        collisionDetection();
        addWormPathSegment(gameState, worm, pathSegment);
    }


    function addWormPathSegment(gameState, worm, segment) {
        var segments = worm.pathSegments;
        if (segments.length === 0) {
            segments.push(segment);
        } else {
            var lastSegment = segments[segments.length - 1];
            if (lastSegment.startTime >= gameStateFunctions.getLastClearTime(gameState) &&
                    segment.type === lastSegment.type &&
                    segment.speed === lastSegment.speed &&
                    segment.turningVelocity === lastSegment.turningVelocity &&
                    segment.size === lastSegment.size &&
                    segment.playerId === lastSegment.playerId &&
                    segment.jump === lastSegment.jump) {
                // Continue last segment
                lastSegment.duration += segment.duration;
                lastSegment.endX = segment.endX;
                lastSegment.endY = segment.endY;
                lastSegment.endDirection = segment.endDirection;
                if (segment.type === "arc") {
                    lastSegment.arcEndAngle = segment.arcEndAngle;
                    lastSegment.arcAngleDiff += segment.arcAngleDiff;
                }
            } else {
                // Start new segment
                segments.push(segment);
            }
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
