var EventEmitter = require("events").EventEmitter;

var EVENT_COLLISION_MAP = "wormMapCollision";
var events = [EVENT_COLLISION_MAP];

module.exports = function CollisionHandler(mapUtils) {
    var eventEmitter = new EventEmitter();

    function wormMapCollisionDetection(players, player, worm, map) {
        var head = worm.head;
        if (!mapUtils.isInsidePlayableArea(map, head)) {
            eventEmitter.emit(EVENT_COLLISION_MAP, players, player, worm, map);
        }
    }

    function wormWormCollisionDetection(player) {
        //    TODO
    }

    function wormPowerUpCollisionDetection(player) {
        //    TODO
    }

    return {
        wormMapCollisionDetection: wormMapCollisionDetection,
        on: eventEmitter.on.bind(eventEmitter)
    }
}
