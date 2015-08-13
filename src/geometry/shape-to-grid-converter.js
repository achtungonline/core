var gridUtils = require("./../grid/grid-utils.js");

var circleType = require("./shape/circle.js").type;
var rectType = require("./shape/rectangle.js").type;

var convertFunctions = getConvertFunctions();


function getConvertFunctions() {
    var functions = {};

    functions[rectType] = function rectToGrid(rect, grid) {
        var leftRow = Math.round(rect.y / grid.cellSize);
        var leftCol = Math.round(rect.x / grid.cellSize);

        var rightRow = Math.round(rect.maxY / grid.cellSize);
        var rightCol = Math.round(rect.maxX / grid.cellSize);

        var size = (rightRow - leftRow + 1) * (rightCol - leftCol + 1);
        var points = new Array(size);
        var index = 0;
        for (var row = leftRow; row <= rightRow; row++) {
            for (var col = leftCol; col <= rightCol; col++) {
                if (gridUtils.isInsideGrid(grid, row, col)) {
                    points[index++] = (gridUtils.coordinatesToIndex(grid, row, col));
                }
            }
        }

        return points;
    };

    functions[circleType] = function circleToGrid(circle, grid) {
        return convertFunctions[rectType](circle, grid);

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