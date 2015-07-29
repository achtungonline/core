var EventEmitter = require("events").EventEmitter;

var EVENT_COLLISION_MAP = "collisionMap";
var events = [EVENT_COLLISION_MAP];

module.exports = function WormModifier(mapUtils, shapeModifier, clone) {
    var eventEmitter = new EventEmitter();

    function moveWorm(deltaTime, worm) {
        var xDiff = Math.cos(worm.direction) * worm.speed * deltaTime;
        var yDiff = Math.sin(worm.direction) * worm.speed * deltaTime;

        shapeModifier.move(worm.head, xDiff, yDiff);

        worm.body.push(clone(worm.head));
    }

    function performCollisionDetection(players, map, worm) {
        //TODO: Move this function out to a util namespace.
        function getPlayerByWorm(players, worm) {
            for (var i = 0; i < players.length; i++) {
                for (var j = 0; j < players[i].worms.length; j++) {
                    if (players[i].worms[j].id === worm.id) {
                        return players[i];
                    }
                }
            }
        }

        var head = worm.head;

        if (!mapUtils.isInsidePlayableArea(map, head)) {
            eventEmitter.emit(EVENT_COLLISION_MAP, players, getPlayerByWorm(players, worm), worm);
        }
    }

    return {
        moveWorm: moveWorm,
        performCollisionDetection: performCollisionDetection,
        on: eventEmitter.on.bind(eventEmitter)
    };
};