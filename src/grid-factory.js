module.exports = gridFactories = {};
function GridFactory(rows, cols, cellSize) {
    function create() {
        var grid = {};
        grid.cellSize = cellSize;
        grid.rows = rows;
        grid.cols = cols;
        grid.grid = [];
        return grid;
    }

    return {
        create: create
    }
}

gridFactories.GridFactory = GridFactory;

gridFactories.GridFactoryCoveringArea = function (width, height, cellSize) {
    var rows = Math.round(width / cellSize + 0.5);
    var cols = Math.round(height / cellSize + 0.5);
    return GridFactory(rows, cols, cellSize)
}