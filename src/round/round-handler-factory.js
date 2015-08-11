var PhaseFactory = require("./phase-factory.js");
var RoundHandler = require("./round-handler.js");

module.exports = function RoundHandlerFactory(wormHandler, playerHandler) {
    var phaseFactory = PhaseFactory(wormHandler, playerHandler);

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