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
        var newWorm = gameStateFunctions.addWorm(gameState, {
            playerId: worm.playerId,
            direction: worm.direction - Math.PI / 8,
            centerX: worm.centerX,
            centerY: worm.centerY,
            radius: worm.radius,
            distanceTravelled: worm.distanceTravelled,
            distanceTravelledFromCells : clone(worm.distanceTravelledFromCells)
        });
        worm.direction += Math.PI / 8;
        gameStateFunctions.getWormEffects(gameState, worm.id).forEach(function (effect) {
            var clonedEffect = clone(effect);
            clonedEffect.wormId = newWorm.id;
            gameStateFunctions.addEffect(gameState, clonedEffect);
        });
        //TODO Instead of timeLeft, make sure the effects are removed when worm and twin-worm no longer intersect (maybe with a margin)
        gameStateFunctions.addEffect(gameState, {timeLeft: 0.2, wormId: newWorm.id, type: TYPE, twinWormId: worm.id});
        gameStateFunctions.addEffect(gameState, {timeLeft: 0.2, wormId: worm.id, type: TYPE, twinWormId: newWorm.id});
    });
}

module.exports = {
    type: TYPE,
    activate
};
