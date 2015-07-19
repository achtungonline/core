module.exports = function Game(updateHandler, map, players) {

    function update() {
        updateHandler.update();
    }

    function start() {
        updateHandler.init();
        updateHandler.update(players);
    }

    return {
        map: map,
        players: players,
        start: start,
        on: updateHandler.on.bind(updateHandler)
    };
};