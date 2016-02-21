var events = require("./match-events");
var EventEmitter = require("events").EventEmitter;
var gameStateFunctions = require("./game-state-functions.js");

module.exports = function Match(options) {
    var matchState = options.matchState;
    var gameFactory = options.gameFactory;
    var matchConfig = options.matchConfig;

    var eventEmitter = new EventEmitter();
    events = {
        MATCH_OVER: "matchOver",
        SCORE_UPDATED: "scoreUpdated"
    };
    var currentGame;

    function getCurrentGame() {
        return currentGame;
    }

    function isMatchOver() {
        function isMaxScoreReached() {
            return currentGame.gameState.players.filter(p => matchState.score[p.id] >= matchState.maxScore).length > 0;
        }
        return currentGame && currentGame.isGameOver() && isMaxScoreReached();
    }


    function prepareNextGame(seed) {
        currentGame = gameFactory.create({
            seed: seed,
            map: matchConfig.map,
            playerConfigs: matchConfig.playerConfigs
        });

        currentGame.on(currentGame.events.PLAYER_DIED, function (gameState, player) {
            gameStateFunctions.getAlivePlayers(gameState).forEach(function (alivePlayer) {
                matchState.score[alivePlayer.id]++;
            });
            eventEmitter.emit(events.SCORE_UPDATED, matchState);
        });
        currentGame.on(currentGame.events.GAME_OVER, function (gameState) {
            gameStateFunctions.getAlivePlayers(gameState).forEach(function (alivePlayer) {
                matchState.roundsWon[alivePlayer.id]++;
            });
            eventEmitter.emit(events.SCORE_UPDATED, matchState);
        });

        currentGame.on(currentGame.events.GAME_OVER, function (gameState) {
            if (isMaxScoreReached()) {
                eventEmitter.emit(events.MATCH_OVER);
            }
        });

        return currentGame;
    }

    return {
        getCurrentGame: getCurrentGame,
        prepareNextGame: prepareNextGame,
        isMatchOver: isMatchOver,
        matchState: matchState,
        on: eventEmitter.on.bind(eventEmitter),
        events: events
    }
};
