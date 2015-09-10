module.exports = function Grid(rows, cols) {
    var grid = {};
    grid.rows = rows;
    grid.cols = cols;
    grid.grid = new Array(rows * cols);
    return grid;
};