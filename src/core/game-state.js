module.exports = function GameState(players, worms, map, playArea, playAreaUpdateBuffer) {

    return {
        players: players,
        worms: worms,
        //  {
        //      id,
        //      playerId,
        //      head,
        //      direction,
        //      speed,
        //      turningSpeed,
        //      alive,
        //      jump: {
        //          remainingJumpTime: 0,
        //          timeSinceLastJump: 0
        //      },
        //      immunityData: undefined
        //      }
        powerUps: [
        //  {
        //      id
        //      shape
        //      effectType
        //      effectStrength
        //  }
        ],
        effects: [
        //  {
        //      type,
        //      duration,
        //      wormId,
        //      strength,
        //  }
        ],
        map: map,
        playArea: playArea,
        playAreaUpdateBuffer: playAreaUpdateBuffer,
        gameActive: false,
        phaseTimer: 0,                              // Time left until next phase starts (only interesting between startPhase and playPhase)
        phase: "notStartedPhase"                    // notStartedPhase | startPhase | playPhase | roundOverPhase
    };
};
