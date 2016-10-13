import PathCheckerAIHandler from "./path-checker-ai-handler.js";

export default function AIHandler() {
    var pathCheckerAiHandler = PathCheckerAIHandler();

    function addAIPlayer(player) {
        if(player.aiData) {
            throw Error("player.ai is already set: ", player.aiData);
        }

        player.aiData = {};
    }

    function removeAIPlayer(player) {
        player.aiData = undefined;
    }

    function update(gameState, deltaTime) {
        gameState.players.forEach(function (player) {
            if(player.aiData) {
                pathCheckerAiHandler.update(gameState, deltaTime, player);
            }
        });
    }

    return {
        addAIPlayer,
        removeAIPlayer,
        update
    };
};