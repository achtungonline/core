var CoordinateShapeFactory = require("./shapes/coordinate-shape-factory.js");
var ShapeFactory = require("./shapes/shape-factory.js");
var Map = require("./map.js");

module.exports = function MapFactory() {
	var coordShapeFactory = CoordinateShapeFactory();
	var shapeFactory = ShapeFactory();

	function createRectangle(width, height) {
		var rectangle = shapeFactory.createRectangle(width, height);
		var shapes = [coordShapeFactory.create(0, 0, rectangle)];
		return Map(shapes);
	}

	function createSquare(size) {
		return createRectangle(size, size);
	}

	return {
		createSquare: createSquare,
		createRectangle: createRectangle
	};
};