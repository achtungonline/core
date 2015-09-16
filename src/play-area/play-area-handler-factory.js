var ShapeToGridConverter = require("./../geometry/shape-to-grid-converter.js");
var gridUtils = require("./../grid/grid-utils.js");
var PlayAreaHandler = require("./play-area-handler.js");

module.exports = function PlayAreaHandlerFactory() {
    function create() {
        return PlayAreaHandler(gridUtils, ShapeToGridConverter.createShapeToGridConverter());
    }

    return {
        create: create
    };
};
