module.exports = function GameState(players, worms, map, playArea, playAreaUpdateBuffer) {

    return {
        players: players,
        worms: worms,
        powerUps: [],
        effects: [],
        map: map,
        playArea: playArea,
        playAreaUpdateBuffer: playAreaUpdateBuffer,
        gameActive: false,
        phaseTimer: 0,                              // Time left until next phase starts (only interesting between startPhase and playPhase)
        phase: "notStartedPhase"                    // notStartedPhase | startPhase | playPhase | roundOverPhase
    };
};
