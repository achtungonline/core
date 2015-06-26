var utils = module.exports = {};

utils.getWidth = function(shape) {
	if (shape.type === "circle") {
		return shape.radius * 2;
	} else {
		return shape.width;
	}
}