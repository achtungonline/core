import * as gridUtils from "./../util/grid.js";

var convertFunctions = {};
convertFunctions["rectangle"] = function rectToGrid(rect, grid, roundingMode) {
    var leftRow = Math.max(0, roundingMode.roundLeft(rect.y));
    var leftCol = Math.max(0, roundingMode.roundLeft(rect.x));

    var rightRow = Math.min(grid.rows - 1, roundingMode.roundRight(rect.maxY));
    var rightCol = Math.min(grid.cols - 1, roundingMode.roundRight(rect.maxX));

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
convertFunctions["circle"] = function circleToGrid(circle, grid, roundingMode) {
    var firstRow = Math.max(0, roundingMode.roundLeft(circle.y));
    var midRow = Math.round(circle.centerY);
    var lastRow = Math.min(grid.rows - 1, roundingMode.roundRight(circle.maxY));

    var points = [];
    for (var row = firstRow; row <= lastRow; row++) {
        var dy = midRow - row;
        var dx = Math.sqrt(circle.radius * circle.radius - dy * dy);
        var firstCol = Math.max(0, roundingMode.roundLeft((circle.centerX - dx)));
        var lastCol = Math.min(grid.cols - 1, roundingMode.roundRight((circle.centerX + dx)));
        for (var col = firstCol; col <= lastCol; col++) {
            points.push(gridUtils.getIndex(grid, row, col));
        }
    }

    return points;
};

convertFunctions["worm"] = function wormToGrid(worm, grid, roundingMode) {
    return convertFunctions["circle"]({
        centerX: worm.centerX,
        centerY: worm.centerY,
        x: worm.centerX - worm.radius,
        y: worm.centerY - worm.radius,
        maxX: worm.centerX + worm.radius,
        maxY: worm.centerY + worm.radius,
        radius: worm.radius
    }, grid, roundingMode);
};

function createRoundingMode(roundLeft, roundRight) {
    return {roundLeft: roundLeft, roundRight: roundRight};
}


var RoundingModes = {};
RoundingModes.ROUND = createRoundingMode(Math.round, Math.round);
RoundingModes.CONTAINMENT = createRoundingMode(Math.ceil, Math.floor);
RoundingModes.INTERSECTION = createRoundingMode(Math.floor, Math.ceil);

function createShapeToGridConverter() {
    function convert(shape, grid, roundingMode) {
        var type = shape.type || "worm";
        var convertFunction = convertFunctions[type];

        roundingMode = roundingMode || RoundingModes.ROUND;

        if (shape)
            return convertFunction(shape, grid, roundingMode);
    }

    return {
        convert: convert
    };
}

export {
    RoundingModes,
    createShapeToGridConverter
}