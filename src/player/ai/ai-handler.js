module.exports = function AIHandler(game, ais, defaultAiType) {

    game.on(game.events.GAME_UPDATED, function (gameState, deltaTime) {
        update(gameState, deltaTime);
    });

    function addAIPlayer(player, aiType) {
        if(player.aiData) {
            throw Error("player.ai is already set: ", player.aiData);
        }
        if(aiType && !ais[aiType]) {
            throw Error("Unknown AI type: ", aiType);
        }

        player.aiData = {};
        player.aiData.type = (aiType) ? aiType : defaultAiType;
    }

    function removeAIPlayer(player) {
        player.aiData = undefined;
    }

    function update(gameState, deltaTime) {
        gameState.players.forEach(function (player, index) {
            var aiData = player.aiData;
            if(aiData) {
                ais[aiData.type].update(gameState, deltaTime, player);
            }
        });
    }

    return {
        addAIPlayer: addAIPlayer,
        removeAIPlayer: removeAIPlayer
    };
};