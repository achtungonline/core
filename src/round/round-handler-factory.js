var PhaseFactory = require("./phase-factory.js");
var RoundHandler = require("./round-handler.js");

module.exports = function RoundHandlerFactory(eventHandler, wormHandler, collisionHandler) {
    var phaseFactory = PhaseFactory(eventHandler, wormHandler, collisionHandler);

    function create() {
        var phases = [];
        phases.push(phaseFactory.createStartPhase());
        phases.push(phaseFactory.createPlayPhase());
        phases.push(phaseFactory.createRoundOverPhase());
        return RoundHandler(eventHandler, phases);
    }

    return {
        create: create
    }
}