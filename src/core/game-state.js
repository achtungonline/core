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
        //      name
        //      shape
        //      effectType
        //      effectStrength                      // Higher means more potent, negative could mean reversed. For speed effect, -1 means decreased speed for example
        //      effectDuration                      // The duration for the effect, if it has one
        //  }
        ],
        effects: [                                  // Effects only gets created from worms going into powerUps
        //  {
        //      type,
        //      remainingDuration,
        //      wormId,
        //      strength,                           // Comes from the power-ups effectStrength
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
