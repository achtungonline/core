module.exports = function Grid(rows, cols, cellSize) {
    var grid = {};
    grid.cellSize = cellSize;
    grid.rows = rows;
    grid.cols = cols;
    grid.grid = new Array(rows * cols);
    return grid;
};