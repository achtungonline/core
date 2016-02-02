var events = require("./match-events");
var EventEmitter = require("events").EventEmitter;
var forEach = require("./util/for-each");

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
            forEach(game.events, function (event) {
                game.on(event, function () {
                    eventEmitter.emit.apply(eventEmitter, [event].concat(Array.prototype.slice.call(arguments)));
                });
            });
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
        if(currentGame) {
            currentGame.stop();
        }
    }

    function end() {
        endCurrentGame();
    }

    function update(deltaTime) {
        currentGame.update(deltaTime);
    }

    function isActive() {
        return !!currentGame; //TODO check again when score is implemented
    }

    function isCurrentGameActive() {
        return currentGame && currentGame.isActive();
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
        isActive: isActive,
        isCurrentGameActive: isCurrentGameActive,
        setPlayerSteering: setPlayerSteering,
        on: eventEmitter.on.bind(eventEmitter),
        events: events,
        matchConfig: matchConfig // TODO: Unsure if this is good.
    };
};
