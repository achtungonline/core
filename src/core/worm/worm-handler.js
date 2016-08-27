var coreFunctions = require("../core-functions.js");
var clone = require("../util/clone.js");
var shapeFactory = require("../geometry/shape-factory.js");
var gameStateFunctions = require("../game-state-functions.js");
var trajectoryUtil = require("../geometry/trajectory/trajectory-util.js");

module.exports = function WormHandler({playAreaHandler, collisionHandler, wormBodyImmunityHandler}) {

    function pushBodyPart(gameState, worm) {
        var changedCells = playAreaHandler.applyWormHead(gameState, worm);
        wormBodyImmunityHandler.setImmunityCells(worm, changedCells);
    }

    function update(gameState, deltaTime, worm) {
        function updateBody() {
            var bodyPart = clone(worm.head);
            pushBodyPart(gameState, worm, bodyPart);
            return bodyPart;
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

        var direction = coreFunctions.getWormDirection(gameState, worm.id);
        var speed = coreFunctions.getWormSpeed(gameState, worm.id);
        var size = coreFunctions.getWormSize(gameState, worm.id);
        var turningVelocity = coreFunctions.getWormTurningVelocity(gameState, worm.id, deltaTime);
        var jump = coreFunctions.isWormJumping(gameState, worm.id);
        if (gameState.phase === "startPhase") {
            speed = 0;
        }
        var pathSegment = trajectoryUtil.createTrajectory({
            duration: deltaTime,
            startX: worm.head.centerX,
            startY: worm.head.centerY,
            startDirection: direction,
            speed,
            turningVelocity
        });
        pathSegment.startTime = gameState.gameTime - deltaTime;
        pathSegment.endTime = gameState.gameTime;
        pathSegment.jump = jump;
        pathSegment.size = size;
        pathSegment.playerId = worm.playerId;

        worm.head.radius = size/2;
        if (speed > 0 && !jump) {
            // No body update during the start phase and also only render the body if we are not standing still
            updateBody();
        }
        worm.direction += turningVelocity * deltaTime;
        worm.head = shapeFactory.createCircle(worm.head.radius, pathSegment.endX - worm.head.radius, pathSegment.endY - worm.head.radius);
        wormBodyImmunityHandler.update(gameState, worm);
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
