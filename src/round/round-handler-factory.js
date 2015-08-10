var PhaseFactory = require("./phase-factory.js");
var RoundHandler = require("./round-handler.js");

module.exports = function RoundHandlerFactory(wormHandler, playerHandler, aiHandler) {
    var phaseFactory = PhaseFactory(wormHandler, playerHandler, aiHandler);

    function create() {
        var phases = [];
        phases.push(phaseFactory.createStartPhase());
        phases.push(phaseFactory.createPlayPhase());
        phases.push(phaseFactory.createRoundOverPhase());
        return RoundHandler(phases);
    }

    return {
        create: create
    }
}