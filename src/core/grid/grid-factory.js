var Grid = require("./grid.js");

module.exports = function GridFactory(rows, cols) {
    function create() {
        return Grid(rows, cols);
    }

    return {
        create: create
    };
};