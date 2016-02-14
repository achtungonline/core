var events = require("./match-events");
var EventEmitter = require("events").EventEmitter;

module.exports = function Match(options) {
    var gameFactory = options.gameFactory;
    var matchConfig = options.matchConfig;

    var eventEmitter = new EventEmitter();
    var currentGame;

    function getCurrentGame() {
        return currentGame;
    }

    function prepareNextGame(seed) {
        currentGame = gameFactory.create({
            seed: seed,
            map: matchConfig.map,
            playerConfigs: matchConfig.playerConfigs
        });
        return currentGame;
    }

    return {
        getCurrentGame: getCurrentGame,
        prepareNextGame: prepareNextGame,
        on: eventEmitter.on.bind(eventEmitter),
        events: events
    };
};
