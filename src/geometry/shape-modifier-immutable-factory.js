var ShapeFactory = require("./shape-factory.js");
var ShapeModifierI = require("./shape-modifier-immutable.js");

module.exports = function ShapeModifierIFactory() {
    return {
        create: function create() {
            return ShapeModifierI(ShapeFactory());
        }
    }
}
