var gridUtils = require("./../grid/grid-utils.js");

var circleType = require("./shape/circle.js").type;
var rectType = require("./shape/rectangle.js").type;

var convertFunctions = getConvertFunctions();


function getConvertFunctions() {
    var functions = {};

    functions[rectType] = function rectToGrid(rect, grid) {
        var leftRow = Math.max(0, Math.round(rect.y / grid.cellSize));
        var leftCol = Math.max(0, Math.round(rect.x / grid.cellSize));

        var rightRow = Math.min(grid.rows - 1, Math.round(rect.maxY / grid.cellSize));
        var rightCol = Math.min(grid.cols - 1, Math.round(rect.maxX / grid.cellSize));

        var size = (rightRow - leftRow + 1) * (rightCol - leftCol + 1);
        var points = new Array(size);
        var index = 0;
        for (var row = leftRow; row <= rightRow; row++) {
            for (var col = leftCol; col <= rightCol; col++) {
                if (gridUtils.isInsideGrid(grid, row, col)) {
                    points[index++] = (gridUtils.getIndex(grid, row, col));
                }
            }
        }

        return points;
    };

    functions[circleType] = function circleToGrid(circle, grid) {
        var firstRow = Math.max(0, Math.round(circle.y / grid.cellSize));
        var midRow = Math.round(circle.centerY / grid.cellSize);
        var lastRow = Math.min(grid.rows - 1, Math.round(circle.maxY / grid.cellSize));

        var points = [];
        for (var row = firstRow; row <= lastRow; row++) {
            var dy = (midRow - row) * grid.cellSize;
            var dx = Math.sqrt(circle.radius * circle.radius - dy * dy);
            var firstCol = Math.max(0, Math.round((circle.centerX - dx) / grid.cellSize));
            var lastCol = Math.min(grid.cols, Math.round((circle.centerX + dx) / grid.cellSize));
            for (var col = firstCol; col <= lastCol; col++) {
                points.push(gridUtils.getIndex(grid, row, col));
            }
        }

        return points;
    };
    return functions;
}

module.exports = function ShapeToGridConverter() {
    function convert(shape, grid) {
        var convertFunction = convertFunctions[shape.type];

        return convertFunction(shape, grid);
    }

    return {
        convert: convert
    }
};