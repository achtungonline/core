var EventEmitter = require("events").EventEmitter;

var events = {};

events.WORM_MAP_COLLISION = "wormMapCollision";
events.WORM_WORM_COLLISION = "wormWormCollision";

events.GAME_UPDATED = "gameUpdated";
events.GAME_OVER = "gameOver";

events.PLAYER_DIED = "playerDied";

module.exports = function EventHandler() {
    var eventEmitter = new EventEmitter();
    var registeredEvents = {};

    function register(event) {
        if (isRegistered(event)) {
            throw new Error("Same event getting re-registered: " + event);
        }

        registeredEvents[event] = true;
    }

    function emit(event) {
        if (!isRegistered(event)) {
            throw new Error("Event being emited has never been registered: " + event);
        }
        eventEmitter.emit.apply(eventEmitter, arguments);
    }

    function isRegistered(event) {
        return registeredEvents[event];
    }

    return {
        register: register,
        isRegistered: isRegistered,
        emit: emit,
        on: eventEmitter.on.bind(eventEmitter),
        events: events
    }
}