var shapeSpatialRelations = require("../../geometry/shape-spatial-relations.js");
var forEach = require("./../../util/for-each.js");

var IMMUNITY_DISTANCE = 100;

module.exports = function WormBodyImmunityHandler() {

    function createWormData(worm) {
        var data = {};
        data.distance = 0;
        data.position = worm.head;
        return data;
    }

    function getWormData(gameState, worm) {
        var data = gameState.immunityData.wormData[worm.id];
        if (!data) {
            data = gameState.immunityData.wormData[worm.id] = createWormData(worm);
        }
        return data;
    }

    /*
    bodyParts should be a list in the format returned from PlayAreaHandler.getUpdateBuffer()
     */
    function setImmunityCells(gameState, worm, cells) {
        var data = getWormData(gameState, worm);
        cells.forEach(function (cell) {
            gameState.immunityData.cellDistance[cell.index] = data.distance;
        });
    }

    function isImmuneCell(gameState, worm, cell) {
        var data = getWormData(gameState, worm);
        return data.distance - gameState.immunityData.cellDistance[cell] <= IMMUNITY_DISTANCE;
    }

    function update(gameState, worm) {
        var data = getWormData(gameState, worm);
        data.distance += shapeSpatialRelations.distanceSquared(worm.head, data.position);
        data.position = worm.head;
    }

    return {
        setImmunityCells: setImmunityCells,
        isImmuneCell: isImmuneCell,
        update: update
    };
};