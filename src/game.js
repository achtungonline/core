module.exports = function Game(updateHandler, map, players) {
    var eventEmitters = {};

    updateHandler.events.forEach(function (event) {
        if (eventEmitters[event]) {
            throw new Error("Multiple EventEmitters are using the event: " + event);
        }

        eventEmitters[event] = updateHandler;
    });

    function start() {
        updateHandler.init();
        updateHandler.update(players);
    }

    function on(event) {
        var eventEmitter = eventEmitters[event];

        if (!eventEmitter) {
            throw new Error("Invalid event: " + event);
        }

        eventEmitter.on.apply(eventEmitter, arguments);
    }

    return {
        map: map,
        players: players,
        start: start,
        on: on
    };
};