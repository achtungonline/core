var coreFunctions = require("../core-functions.js");
var clone = require("../util/clone.js");
var shapeModifierI = require("../geometry/shape-modifier-immutable.js");
var gameStateFunctions = require("../game-state-functions.js");

var jumpHandler = require("./jump-handler.js")();

module.exports = function WormHandler({playAreaHandler, collisionHandler, wormBodyImmunityHandler}) {

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
            if (speed === 0) {
                // 0 diameter arc
                pathSegment.type = "still_arc";
                xDiff = 0;
                yDiff = 0;
            } else if (turningVelocity === 0) {
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
            wormBodyImmunityHandler.update(gameState, worm);
        }

        function collisionDetection() {

            collisionHandler.wormPowerUpCollision(gameState, worm).forEach(function (powerUpId) {
                coreFunctions.activatePowerUp(gameState, powerUpId, worm.id);
            });
            if (worm.alive && collisionHandler.wormMapCollision(gameState, worm.id)) {
                coreFunctions.killWorm(gameState, worm.id);
            }
            if (worm.alive && !coreFunctions.isWormJumping(gameState, worm.id)) {
                if (collisionHandler.wormWormCollision(gameState, worm)) {
                    coreFunctions.killWorm(gameState, worm.id);
                }
            }
        }

        jumpHandler.update(gameState, deltaTime, worm);

        var direction = coreFunctions.getWormDirection(gameState, worm.id);
        var speed = coreFunctions.getWormSpeed(gameState, worm.id);
        var size = coreFunctions.getWormSize(gameState, worm.id);
        var turningVelocity = coreFunctions.getWormTurningVelocity(gameState, worm.id, deltaTime);
        var jump = coreFunctions.isWormJumping(gameState, worm.id);
        if (gameState.phase === "startPhase") {
            speed = 0;
        }
        var pathSegment = {
            duration: deltaTime,
            startTime: gameState.gameTime - deltaTime,
            endTime: gameState.gameTime,
            startX: worm.head.centerX,
            startY: worm.head.centerY,
            startDirection: worm.direction,
            jump: jump,
            size: size,
            speed: speed,
            turningVelocity: turningVelocity,
            playerId: worm.playerId
        };

        updateHead(size);
        if (speed > 0 && !jump) {
            // No body update during the start phase and also only render the body if we are not standing still
            updateBody();
        }
        updatePosition(speed, turningVelocity, direction, pathSegment);
        collisionDetection();
        gameStateFunctions.addWormPathSegment(gameState, worm.id, pathSegment);
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
        update: update
    };
};
