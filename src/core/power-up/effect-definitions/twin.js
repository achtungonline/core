import * as constants from "./../../constants.js";
import * as gsf from "./../../game-state-functions.js";
import clone from "../../util/clone.js";
import * as shapeSpatialRelations from "./../../geometry/shape-spatial-relations.js";
import * as cf from "./../../core-functions.js";

var type = "twin";

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
        gsf.addEffect(gameState, {timeLeft: 10000, wormId: newWorm.id, type: type, twinWormId: worm.id});
        gsf.addEffect(gameState, {timeLeft: 10000, wormId: worm.id, type: type, twinWormId: newWorm.id});
    });
}

function update(gameState, deltaTime, effect) {
    var worm = gsf.getWorm(gameState, effect.wormId);
    var twinWorm = gsf.getWorm(gameState, effect.twinWormId);
    if (shapeSpatialRelations.distance(worm, twinWorm) >= (cf.getWormRadius(gameState, worm.id) + cf.getWormRadius(gameState, twinWorm.id) + 1)) {
        effect.timeLeft = 0;
    }
}

export {
    type,
    activate,
    update
};
