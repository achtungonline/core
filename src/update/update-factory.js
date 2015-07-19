var UpdateHandler = require("./update-handler.js");
var ShapeHandler = require("../geometry/shape-handler.js");

module.exports = function UpdateFactory() {
    return {
        createUpdateHandler: function (updateFinishedHandler) {
            return UpdateHandler(ShapeHandler(), updateFinishedHandler);
        }
    }
}
