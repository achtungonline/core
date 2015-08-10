var PhaseFactory = require("./phase-factory.js");
var RoundHandler = require("./round-handler.js");

module.exports = function RoundHandlerFactory(eventHandler, wormHandler, collisionHandler, aiHandler) {
    var phaseFactory = PhaseFactory(eventHandler, wormHandler, collisionHandler, aiHandler);

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