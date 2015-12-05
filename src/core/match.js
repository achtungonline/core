var events = require("./match-events");
var EventEmitter = require("events").EventEmitter;

module.exports = function Match(options) {
    var random = options.random;
    var gameFactory = options.gameFactory;
    var matchConfig = options.matchConfig;

    var eventEmitter = new EventEmitter();
    var currentGame;

    function getCurrentGameState() {
        return currentGame.gameState;
    }

    function startNextGame() {
        function redirectGameEvents(game) {
            game.events.forEach(function (event) {
                game.on(event, function () {
                    eventEmitter.emit.apply(eventEmitter, [event].concat(Array.prototype.slice.call(arguments)));
                })
            })
        }

        if (currentGame && currentGame.isActive()) {
            throw new Error("Current game is still active/running. You need to stop it before starting the next game");
        }

        if (true) { //TODO Fix this logic when score is implemented
            currentGame = gameFactory.create({
                random: random,
                map: matchConfig.map,
                playerConfigs: matchConfig.playerConfigs
            });
            redirectGameEvents(currentGame);
            currentGame.start();
        }
    }

    function endCurrentGame() {
        currentGame && currentGame.stop();
    }

    function end() {
        endCurrentGame();
    }

    function update(deltaTime) {
        currentGame.update(deltaTime)
    }

    function setPlayerSteering(player, steering) { //TODO take ID instead of player
        currentGame.setPlayerSteering(player, steering);
    }

    return {
        getCurrentGameState: getCurrentGameState,
        startNextGame: startNextGame,
        endCurrentGame: endCurrentGame,
        end: end,
        update: update,
        setPlayerSteering: setPlayerSteering,
        on: eventEmitter.bind(eventEmitter),
        events: events
    };
};
