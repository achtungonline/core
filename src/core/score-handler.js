var events = require("./match-events");
var EventEmitter = require("events").EventEmitter;
var gameStateFunctions = require("./game-state-functions.js");

module.exports = function Match(options) {
    var game = options.game;
    var scoreState = options.scoreState;
    var eventEmitter = new EventEmitter();
    events = {
        SCORE_UPDATED: "scoreUpdated"
    };

    function updateScore(gameState) {
        gameStateFunctions.getAlivePlayers(gameState).forEach(function (alivePlayer) {
            scoreState.score[alivePlayer.id]++;
        });
        eventEmitter.emit(events.SCORE_UPDATED, scoreState);
    }

    function gameOver(gameState) {
        function updateRoundsWon(gameState) {
            gameStateFunctions.getAlivePlayers(gameState).forEach(function (alivePlayer) {
                scoreState.roundsWon[alivePlayer.id]++;
            });
            eventEmitter.emit(events.SCORE_UPDATED, scoreState);
        }

        updateRoundsWon(gameState);
        stop();
    }

    function start() {
        game.on(game.events.PLAYER_DIED, updateScore);
        game.on(game.events.GAME_OVER, gameOver);
    }

    function stop() {
        game.off(game.events.PLAYER_DIED, updateScore);
        game.off(game.events.GAME_OVER, gameOver)
    }

    start();

    return {
        scoreState: scoreState,
        on: eventEmitter.on.bind(eventEmitter),
        off: eventEmitter.removeListener.bind(eventEmitter),
        events: events
    }
};
