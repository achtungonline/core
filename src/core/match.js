var events = require("./match-events");
var EventEmitter = require("events").EventEmitter;
var gameStateFunctions = require("./game-state-functions.js");
var ScoreHandler = require("./score-handler.js");

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
    var currentScoreHandler;

    function getCurrentGame() {
        return currentGame;
    }

    function getCurrentScoreHandler() {
        return currentScoreHandler;
    }

    function isMaxScoreReached() {
        return currentGame.gameState.players.filter(p => matchState.score[p.id] >= matchState.maxScore).length > 0;
    }

    function isMatchOver() {
        return currentGame && currentGame.isGameOver() && isMaxScoreReached();
    }


    function prepareNextGame(seed) {
        currentGame = gameFactory.create({
            seed: seed,
            map: matchConfig.map,
            playerConfigs: matchConfig.playerConfigs
        });

        currentScoreHandler = ScoreHandler({game: currentGame, scoreState: matchState});

        return currentGame;
    }

    return {
        getCurrentGame: getCurrentGame,
        getCurrentScoreHandler: getCurrentScoreHandler,
        prepareNextGame: prepareNextGame,
        isMatchOver: isMatchOver,
        matchState: matchState,
        on: eventEmitter.on.bind(eventEmitter),
        events: events
    }
};
