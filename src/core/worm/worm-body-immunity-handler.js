var shapeSpatialRelations = require("../geometry/shape-spatial-relations.js");
var coreFunctions = require("../core-functions.js");
var IMMUNITY_DISTANCE_MULTIPLIER = 3;

module.exports = function WormBodyImmunityHandler() {
    function createWormImmunityData(worm) {
        var data = {};
        data.distanceTravelled = 0;
        data.prevPosition = worm.head;
        data.cellsDistanceTravelled = {};
        return data;
    }

    function getWormImmunityData(worm) {
        if (!worm.immunityData) {
            worm.immunityData = createWormImmunityData(worm);
        }
        return worm.immunityData;
    }

    /*
    bodyParts should be a list in the format returned from PlayAreaHandler.getUpdateBuffer()
     */
    function setImmunityCells(worm, cells) {
        var data = getWormImmunityData(worm);
        cells.forEach(function (cell) {
            worm.immunityData.cellsDistanceTravelled[cell.index] = data.distanceTravelled;
        });
    }

    function isImmuneCell(gameState, worm, cell) {
        var data = getWormImmunityData(worm);
        return data.distanceTravelled - data.cellsDistanceTravelled[cell] <= IMMUNITY_DISTANCE_MULTIPLIER * coreFunctions.getWormSize(gameState, worm.id);
    }

    function update(gameState, worm) {
        var data = getWormImmunityData(worm);
        data.distanceTravelled += shapeSpatialRelations.distanceSquared(worm.head, data.prevPosition);
        data.prevPosition = worm.head;
    }

    return {
        setImmunityCells: setImmunityCells,
        isImmuneCell: isImmuneCell,
        update: update
    };
};
