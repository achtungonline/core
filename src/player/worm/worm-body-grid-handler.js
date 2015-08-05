module.exports = function wormBodyGridHandler(gridFactory) {
    var wormBodyGrids = {};

    function getCell(wormBodyGrid, row, col) {
        var grid = wormBodyGrid.grid;
        if (row < 0 || row >= wormBodyGrid.rows || col < 0 || col >= wormBodyGrid.grid.columns) {
            return undefined;
        }
        if (!grid[row]) {
            grid[row] = [];
        }

        if (!grid[row][col]) {
            grid[row][col] = [];
        }
        return grid[row][col];
    };

    function convertToGridPos(wormBodyGrid, x, y) {
        var row = (x / wormBodyGrid.cellSize) | 0;
        var col = (y / wormBodyGrid.cellSize) | 0;
        var pos = {}
        pos.row = row;
        pos.col = col;
        return pos;
    }

    function getIntersectingCells(wormBodyGrid, shape) {
        var intersectingCells = [];
        var minGridPos = convertToGridPos(wormBodyGrid, shape.x, shape.y);
        var maxGridPos = convertToGridPos(wormBodyGrid, shape.maxX, shape.maxY)

        var minRow, maxRow, minCol, maxCol;
        minRow = minGridPos.row;
        maxRow = maxGridPos.row;
        minCol = minGridPos.col;
        maxCol = maxGridPos.col;

        for (var row = minRow; row <= maxRow; row++) {
            for (var col = minCol; col <= maxCol; col++) {
                var cell = getCell(wormBodyGrid, row, col);
                if (cell) {
                    intersectingCells.push(cell);
                }
            }
        }
        return intersectingCells;
    }


    function addBodyPart(worm, bodyPart) {
        var wormBodyGrid = getWormBodyGrid(worm);
        var intersectingCells = getIntersectingCells(wormBodyGrid, bodyPart);

        intersectingCells.forEach(function (cell) {
            cell.push(bodyPart);
        });
    }

    function removeBodyPart(worm, bodyPart) {
        var wormBodyGrid = getWormBodyGrid(worm);
        var intersectingCells = getIntersectingCells(wormBodyGrid, bodyPart);

        intersectingCells.forEach(function (cell) {
            for (var i = 0; i < cell.length; i++) {
                if (cell[i] == bodyPart) {
                    cell.splice(i, 1);
                    break;
                }
            }
        });
    }

    function getWormBodyGrid(worm) {
        if (!wormBodyGrids[worm.id]) {
            wormBodyGrids[worm.id] = gridFactory.create();
        }
        return wormBodyGrids[worm.id];
    }


    return {
        addBodyPart: addBodyPart,
        removeBodyPart: removeBodyPart,
        getWormBodyGrid: getWormBodyGrid,
        getIntersectingCells: getIntersectingCells
    }
}