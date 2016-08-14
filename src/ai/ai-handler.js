var PathCheckerAIHandler = require("./path-checker-ai-handler.js");
var RandomAIHandler = require("./random-ai-handler.js");

module.exports = function AIHandler(game) {
    var pathCheckerAiHandler = PathCheckerAIHandler(game);
    var randomAiHandler = RandomAIHandler(game);

    var ais = [];
    ais[pathCheckerAiHandler.type] = pathCheckerAiHandler;
    ais[randomAiHandler.type] = randomAiHandler;

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
        player.aiData.type = (aiType) ? aiType : pathCheckerAiHandler.type;
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