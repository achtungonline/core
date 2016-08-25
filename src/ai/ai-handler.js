var PathCheckerAIHandler = require("./path-checker-ai-handler.js");

module.exports = function AIHandler() {
    var pathCheckerAiHandler = PathCheckerAIHandler();

    var ais = [];
    ais[pathCheckerAiHandler.type] = pathCheckerAiHandler;

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
        addAIPlayer,
        removeAIPlayer,
        update
    };
};