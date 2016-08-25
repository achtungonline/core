var gameStateFunctions = require("./../game-state-functions.js");

module.exports = function PlayerHandler() {

    function update(gameState, deltaTime) {
        gameState.players.forEach(function (player) {
            gameStateFunctions.addPlayerSteeringSegment(gameState, player.id, player.steering, deltaTime);
        });
    }

    return {
        update: update
    };
};
