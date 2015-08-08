var EventEmitter = require("events").EventEmitter;
var forEach = require("./util/for-each.js");

var events = {};

events.GAME_UPDATED = "gameUpdated";
events.GAME_OVER = "gameOver";
events.GAME_ROUND_PHASE_STARTED = "gameRoundPhaseStarted";

events.WORM_MAP_COLLISION = "wormMapCollision";
events.WORM_WORM_COLLISION = "wormWormCollision";

events.PLAYER_DIED = "playerDied";
events.WORM_DIED = "wormDied";

module.exports = function EventHandler() {
    var eventEmitter = new EventEmitter();
    var approvedEvents = [];
    forEach(events, function (event) {
        approvedEvents[event] = true;
    });

    function emit(event) {
        checkEvent(event);
        eventEmitter.emit.apply(eventEmitter, arguments);
    }

    function on(event, listener) {
        checkEvent(event);
        eventEmitter.on.apply(eventEmitter, arguments);
    }

    function checkEvent(event) {
        if (approvedEvents[event]) {
            return;
        }

        throw Error("The event: " + event + " is not in the list of approved events.");
    }

    return {
        emit: emit,
        on: on,
        events: events
    }
};