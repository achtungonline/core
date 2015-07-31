module.exports = function Game(updateManager, playerHandler, playerModifier, map, players) {
    var eventEmitters = {};

    updateManager.events.forEach(function (event) {
        if (eventEmitters[event]) {
            throw new Error("Multiple EventEmitters are using the event: " + event);
        }

        eventEmitters[event] = updateManager;
    });

    function start() {
        updateManager.start(players, map);
    }

    function on(event, listener) {
        var eventEmitter = eventEmitters[event];

        if (!eventEmitter) {
            throw new Error("Invalid event: " + event);
        }

        eventEmitter.on(event, listener);
    }

    function setPlayerSteering(player, steering) {
        playerModifier.setSteering(player, steering);
    }

    return {
        map: map,
        players: players,
        start: start,
        on: on,
        setPlayerSteering: setPlayerSteering
    };
};