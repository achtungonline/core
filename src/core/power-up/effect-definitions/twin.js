var constants = require("./../../constants.js");
var gsf = require("./../../game-state-functions.js");
var clone = require("../../util/clone.js");

var TYPE = "twin";

function activate({ gameState, wormId, affects}) {
    var affectedWorms = [];

    if (affects === "self") {
        affectedWorms.push(gsf.getWorm(gameState, wormId));
    } else if (affects === "others") {
        affectedWorms = gsf.getAliveEnemyWorms(gameState, wormId);
    } else if (affects === "all") {
        affectedWorms = gsf.getAliveWorms(gameState);
    }

    affectedWorms.forEach(function (worm) {
        var newWorm = gsf.addWorm(gameState, gsf.createWorm(gameState, {
            playerId: worm.playerId,
            direction: worm.direction - Math.PI / 8,
            centerX: worm.centerX,
            centerY: worm.centerY,
            radius: worm.radius,
            distanceTravelled: worm.distanceTravelled,
            distanceTravelledFromCells: clone(worm.distanceTravelledFromCells)
        }));
        worm.direction += Math.PI / 8;
        gsf.getWormEffects(gameState, worm.id).forEach(function (effect) {
            var clonedEffect = clone(effect);
            clonedEffect.wormId = newWorm.id;
            gsf.addEffect(gameState, clonedEffect);
        });
        //TODO Instead of timeLeft, make sure the effects are removed when worm and twin-worm no longer intersect (maybe with a margin)
        gsf.addEffect(gameState, {timeLeft: 0.2, wormId: newWorm.id, type: TYPE, twinWormId: worm.id});
        gsf.addEffect(gameState, {timeLeft: 0.2, wormId: worm.id, type: TYPE, twinWormId: newWorm.id});
    });
}

module.exports = {
    type: TYPE,
    activate
};
