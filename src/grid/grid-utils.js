var utils = module.exports = {};

utils.coordinatesToIndex = function coordinatesToIndex(grid, row, col) {
    return row * grid.rows + col;
};

utils.isInsideGrid = function isInsideGrid(grid, row, col) {
    return row >= 0 && row < grid.rows && col >= 0 && col < grid.cols;
};