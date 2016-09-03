var constants = require("./../../constants.js");
var gameStateFunctions = require("./../../game-state-functions.js");
var clone = require("../../util/clone.js");

var TYPE = "twin";

function activate({ gameState, wormId, affects}) {
    var affectedWorms = [];

    if (affects === "self") {
        affectedWorms.push(gameStateFunctions.getWorm(gameState, wormId));
    } else if (affects === "others") {
        affectedWorms = gameStateFunctions.getAliveEnemyWorms(gameState, wormId);
    } else if (affects === "all") {
        affectedWorms = gameStateFunctions.getAliveWorms(gameState);
    }

    affectedWorms.forEach(function (worm) {
        var newWorm = gameStateFunctions.addWorm(gameState, {playerId: worm.playerId, direction: worm.direction - Math.PI / 4, head: clone(worm.head)});
        worm.direction += Math.PI / 4;
                gameStateFunctions.getWormEffects(gameState, worm.id).forEach(function(effect) {
            var clonedEffect = clone(effect);
            clonedEffect.wormId = newWorm.id;
            gameStateFunctions.addEffect(gameState, clonedEffect);
        });
        newWorm.immunityData = clone(worm.immunityData);
    });
}

module.exports = {
    type: TYPE,
    activate
};
