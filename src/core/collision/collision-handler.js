var ShapeToGridConverter = require("../geometry/shape-to-grid-converter.js");
var constants = require("../constants.js");
var gameStateFunctions = require("../game-state-functions.js");
var shapeSpatialRelations = require("../geometry/shape-spatial-relations.js");

module.exports = function CollisionHandler({wormBodyImmunityHandler}) {

    var shapeToGridConverter = ShapeToGridConverter.createShapeToGridConverter();

    function wormMapCollision(gameState, wormId) {
        var worm = gameStateFunctions.getWorm(gameState, wormId);
        return !shapeSpatialRelations.contains(gameState.map.shape, worm.head);
    }

    function wormWormCollision(gameState, worm) {
        var playArea = gameState.playArea;
        var cells = shapeToGridConverter.convert(worm.head, playArea, ShapeToGridConverter.RoundingModes.CONTAINMENT);
        return cells.some(function (cell) {
            var value = playArea.grid[cell];
            if (value !== constants.PLAY_AREA_FREE) { // TODO Utility function to check if worm-id
                if (value !== worm.id || !wormBodyImmunityHandler.isImmuneCell(gameState, worm, cell)) {
                    return true;
                }
            }
        });
    }

    function wormPowerUpCollision(gameState, worm) {
        var powerUps = gameState.powerUps;
        var collidedPowerUps = [];
        powerUps.forEach(function(powerUp) {
            if(shapeSpatialRelations.intersects(worm.head, powerUp.shape)) {
                collidedPowerUps.push(powerUp.id);
            }
        });
        return collidedPowerUps;
    }

    return {
        wormMapCollision,
        wormWormCollision,
        wormPowerUpCollision
    };
};
