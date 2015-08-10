module.exports = function AIHandler() {

    var playerAI = [];

    function createPlayerAI(player, ai) {
        return {player: player, ai: ai}
    }

    function addAIPlayer(player, ai) {
        playerAI.push(createPlayerAI(player, ai));
    }

    function removeAIPlayer(player) {
        playerAI.forEach(function (ai, index, list) {
            if (player.id === ai.player.id) {
                list.splice(index, 1);
            }
        });
    }

    function update() {
        playerAI.forEach(function(ai) {
            ai.ai.update();
        });
    }

    return  {
        addAIPlayer: addAIPlayer,
        update: update,
        removeAIPlayer: removeAIPlayer
    }

};