var utils = module.exports = {};

utils.getIndex = function getIndex(grid, row, col) {
    return row * grid.cols + col;
};

utils.getRowCol = function getRowCol(grid, index) {
    var rowCol = {};
    rowCol.row = Math.floor(index / grid.cols);
    rowCol.col = index - rowCol.row * grid.cols;
    return rowCol;
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