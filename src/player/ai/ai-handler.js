var PathCheckerAI = require("./path-checker-ai.js");

module.exports = function AIHandler(game, collisionHandler, trajectoryHandler, random) {

    game.on(game.events.GAME_UPDATED, function () {
        update(game.gameState);
    });

    var players = [];
    var ais = [];

    function addAIPlayer(player) {
        players.push(player);
        ais.push(PathCheckerAI(game, collisionHandler, trajectoryHandler, random));
    }

    function removeAIPlayer(player) {
        players.forEach(function (pl, index) {
            if (player.id === pl.id) {
                players.splice(index, 1);
                ais.splice(index, 1);
            }
        });
    }

    function update(gameState) {
        players.forEach(function (player, index) {
            ais[index].update(gameState, player);
        });
    }

    return {
        addAIPlayer: addAIPlayer,
        removeAIPlayer: removeAIPlayer
    };
};