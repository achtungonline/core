var RandomAI = require("./random-ai.js");

module.exports = function AIHandler(game) {

    game.on(game.events.GAME_UPDATED, function() {
        update();
    });

    var players = [];
    var ais = [];

    function addAIPlayer(player) {
        players.push(player);
        ais.push(RandomAI(game));
    }

    function removeAIPlayer(player) {
        players.forEach(function (pl, index) {
            if (player.id === pl.id) {
                players.splice(index, 1);
                ais.splice(index, 1);
            }
        });
    }

    function update() {
        players.forEach(function(player, index) {
            ais[index].update(player);
        });
    }

    return  {
        addAIPlayer: addAIPlayer,
        removeAIPlayer: removeAIPlayer
    }

};