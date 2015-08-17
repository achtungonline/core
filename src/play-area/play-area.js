var Grid = require("./../grid/grid.js");

var PlayArea = module.exports = {};

PlayArea.FREE = -1;
PlayArea.OBSTACLE = -2;

PlayArea.createPlayArea = function createPlayArea(width, height) {
    var grid = Grid(height, width, 1);
    for (var i = 0; i < grid.grid.length; i++) {
        grid.grid[i] = PlayArea.FREE;
    }
    return grid;
};