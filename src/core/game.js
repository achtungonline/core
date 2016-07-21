var forEach = require("./util/for-each.js");
var EventEmitter = require("events").EventEmitter;
var gameStateFunctions = require("./game-state-functions.js");

module.exports = function Game(gameState, gameEngine, playerHandler) {
    var eventEmitter = new EventEmitter();

    var events = gameEngine.events;

    function extendEvents(emitter) {
        forEach(emitter.events, function (event, eventKey) {
            events[eventKey] = event;
            emitter.on(event, function () {
                eventEmitter.emit.apply(eventEmitter, [event].concat(Array.prototype.slice.call(arguments)));
            });
        });
    }

    extendEvents(gameEngine);
    extendEvents(playerHandler);

    function start() {
        gameEngine.start(gameState);
    }

    function stop() {
        gameEngine.stop(gameState);
    }

    function update(deltaTime) {
        gameEngine.update(gameState, deltaTime);
    }

    function setPlayerSteering(playerId, steering) {
        var player = gameStateFunctions.getPlayer(gameState, playerId);
        var currentSteering = player.steering;
        if(currentSteering !== steering) {
            player.gameTimeWhenSteeringChanged = gameState.gameTime;
            gameStateFunctions.getPlayer(gameState, playerId).steering = steering;
        }
    }

    function isGameOver() {
        return gameState.phase === "roundOverPhase";
    }

    return {
        gameState: gameState,
        start: start,
        stop: stop,
        isActive: gameEngine.isActive.bind(null, gameState),
        isGameOver: isGameOver,
        update: update,
        setPlayerSteering: setPlayerSteering,
        on: eventEmitter.on.bind(eventEmitter),
        off: eventEmitter.removeListener.bind(eventEmitter),
        events: events
    };
};
