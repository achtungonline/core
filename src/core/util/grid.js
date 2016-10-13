function getIndex(grid, row, col) {
    return row * grid.cols + col;
}

function getRowCol(grid, index) {
    var rowCol = {};
    rowCol.row = Math.floor(index / grid.cols);
    rowCol.col = index - rowCol.row * grid.cols;
    return rowCol;
}

function isInsideGrid(grid, row, col) {
    return row >= 0 && row < grid.rows && col >= 0 && col < grid.cols;
}

export {
    getIndex,
    getRowCol,
    isInsideGrid
}