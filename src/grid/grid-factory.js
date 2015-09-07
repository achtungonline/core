var Grid = require("./grid.js");

module.exports = gridFactories = {};
function GridFactory(rows, cols, cellSize) {
    function create() {
        return Grid(rows, cols, cellSize);
    }

    return {
        create: create
    };
}

gridFactories.GridFactory = GridFactory;

gridFactories.GridFactoryCoveringArea = function (width, height, cellSize) {
    var rows = Math.round(width / cellSize + 0.5);
    var cols = Math.round(height / cellSize + 0.5);
    return GridFactory(rows, cols, cellSize);
};