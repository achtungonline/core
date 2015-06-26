var MapFactory = require("./map-factory.js");
var Game = require("./game.js");

module.exports = function GameFactory() {
	var mapFactory = MapFactory();

	return {
		create: function() {
			var map = mapFactory.createSquare(800);
			return Game(map);
		}
	};
};