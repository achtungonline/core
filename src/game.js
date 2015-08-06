module.exports = function Game(updateManager, playerHandler, playerModifier, eventHandler, map, players, wormBodyGrids) {

    function start() {
        //BAJ
        updateManager.start(players, map);
    }

    function on(event, listener) {

        if (!eventHandler.isRegistered(event)) {
            throw new Error("Invalid event: " + event);
        }

        eventHandler.on(event, listener);
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