var shapeSpatialRelations = require("../../geometry/shape-spatial-relations.js");
var forEach = require("./../../util/for-each.js");

var IMMUNITY_DISTANCE = 100;

module.exports = function WormBodyImmunityHandler() {
    var cellDistance = {};
    var wormData = {};

    function createWormData(worm) {
        var data = {};
        data.distance = 0;
        data.position = worm.head;
        return data;
    }

    function getWormData(worm) {
        var data = wormData[worm.id];
        if (!data) {
            data = wormData[worm.id] = createWormData(worm);
        }
        return data;
    }

    /*
    bodyParts should be a list in the format returned from PlayAreaHandler.getUpdateBuffer()
     */
    function setImmunityCells(worm, cells) {
        var data = getWormData(worm);
        cells.forEach(function (cell) {
            cellDistance[cell.index] = data.distance;
        });
    }

    function isImmuneCell(worm, cell) {
        var data = getWormData(worm);
        return data.distance - cellDistance[cell] <= IMMUNITY_DISTANCE;
    }

    function update(worm) {
        var data = getWormData(worm);
        data.distance += shapeSpatialRelations.distanceSquared(worm.head, data.position);
        data.position = worm.head;
    }

    return {
        setImmunityCells: setImmunityCells,
        isImmuneCell: isImmuneCell,
        update: update
    };
};