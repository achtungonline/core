var utils = module.exports = {};

utils.coordinatesToIndex = function coordinatesToIndex(grid, row, col) {
    return row * grid.cols + col;
};

utils.isInsideGrid = function isInsideGrid(grid, row, col) {
    return row >= 0 && row < grid.rows && col >= 0 && col < grid.cols;
};

utils.fillGrid = function fillGrid(grid, value) {
    var g = grid.grid;
    for (var i = 0; i < g.length; i++) {
        g[i] = value;
    }
};