module.exports = function wormBodyGridHandler(eventHandler, gridFactory) {
    var wormBodyGrids = {};

    eventHandler.on(eventHandler.WORM_BODY_ADDED, function onWormBodyAdded(worm, bodyPart) {
        if (!wormBodyGrids[worm.id]) {
            wormBodyGrids[worm.id] = gridFactory.create();
        }
        updateGrid(wormBodyGrids[worm.id], bodyPart)
    });


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


    function updateGrid(wormBodyGrid, bodyPart) {
        var intersectingCells = getIntersectingCells(wormBodyGrid, bodyPart);

        intersectingCells.forEach(function (cell) {
            cell.push(bodyPart);
        });
    }

    function getWormBodyGrid(worm) {
        return wormBodyGrids[worm.id];
    }


    return {
        getWormBodyGrid: getWormBodyGrid,
        getIntersectingCells: getIntersectingCells
    }
}