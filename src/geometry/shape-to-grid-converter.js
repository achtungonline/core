var gridUtils = require("./../grid/grid-utils.js");

var circleType = require("./shape/circle.js").type;
var rectType = require("./shape/rectangle.js").type;

var convertFunctions = getConvertFunctions();


function getConvertFunctions() {
    var functions = {};

    functions[rectType] = function rectToGrid(rect, grid) {
        var points = [];

        var leftRow = Math.floor(rect.x / grid.cellSize) + 0.5;
        var leftCol = Math.floor(rect.y / grid.cellSize) + 0.5;

        var rightRow = Math.floor(rect.maxX / grid.cellSize) - 0.5;
        var rightCol = Math.floor(rect.maxY / grid.cellSize) - 0.5;

        for (var row = leftRow; leftRow <= rightRow; row++) {
            for (var col = leftCol; leftCol <= rightCol; col++) {
                if (gridUtils.isInsideGrid(grid, row, col)) {
                    points.push(gridUtils.coordinatesToIndex(grid, row, col));
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