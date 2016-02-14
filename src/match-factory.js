var GameFactory = require("./game-factory");
var Match = require("./core/match");
var MapFactory = require("./core/map/map-factory.js");
var ShapeFactory = require("./core/geometry/shape-factory.js");
var MatchState = require("./core/match-state.js");

module.exports = function MatchFactory() {
    var gameFactory = GameFactory();

    function create(options) {
        function createDefaultMap() {
            var sf = ShapeFactory();
            var mapShape = sf.createRectangle(800, 1000, 0, 0);
            var mapObstaclesShapes = [sf.createCircle(100, 100, 300), sf.createRectangle(200, 300, 500, 250)];
            return MapFactory().create(mapShape, mapObstaclesShapes);
        }

        var matchConfig = options.matchConfig;
        matchConfig.map = matchConfig.map || createDefaultMap();
        var score = {};
        matchConfig.playerConfigs.forEach(function (playerConfig) {
            score[playerConfig.id] = 0;
        });
        var matchState = MatchState(score, matchConfig.maxScore);


        return Match({
            matchState: matchState,
            gameFactory: gameFactory,
            matchConfig: matchConfig
        });
    }

    return {
        create: create
    };
};
