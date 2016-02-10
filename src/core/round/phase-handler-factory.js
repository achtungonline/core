var PhaseFactory = require("./phase-factory.js");
var PhaseHandler = require("./phase-handler.js");

module.exports = function RoundHandlerFactory(deps) {
    var phaseFactory = PhaseFactory(deps);

    function create() {
        var phases = [];
        phases.push(phaseFactory.createStartPhase());
        phases.push(phaseFactory.createPlayPhase());
        phases.push(phaseFactory.createRoundOverPhase());
        return PhaseHandler(phases);
    }

    return {
        create: create
    };
};