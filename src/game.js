module.exports = function Game(updateHandler, map, players) {
    var eventEmitters = {};

    updateHandler.events.forEach(function (event) {
        if (eventEmitters[event]) {
            throw new Error("Multiple EventEmitters are using the event: " + event);
        }

        eventEmitters[event] = updateHandler;
    });

    function start() {
        updateHandler.start(players, map);
    }

    function on(event, listener) {
        var eventEmitter = eventEmitters[event];

        if (!eventEmitter) {
            throw new Error("Invalid event: " + event);
        }

        eventEmitter.on(event, listener);
    }

    function setPlayerSteering(player, steering) {
        updateHandler.setPlayerSteering(player, steering);
    }

    return {
        map: map,
        players: players,
        start: start,
        on: on,
        setPlayerSteering: setPlayerSteering
    };
};