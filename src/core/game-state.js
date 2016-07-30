module.exports = function GameState(players, worms, map, playArea, playAreaUpdateBuffer, seed) {

    return {
        players: players,
        //  {
        //      id,
        //      steering,
        //      steeringSegments: [ {steering, startTime, duration} ],
        //      alive
        //  }
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
        //      pathSegments: [
        //          {type: straight/curve, duration, startTime, jump, playerId, startX, startY, startDirection, endX, endY, endDirection}
        //      ]
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
        gameEvents: [],
        powerUpEvents: [],
        map: map,
        playArea: playArea,
        playAreaUpdateBuffer: playAreaUpdateBuffer,
        gameTime: 0,
        gameActive: false,                           // TODO: might get removed and replaced with just phase
        phaseTimer: 0,                              // Time left until next phase starts (only interesting between startPhase and playPhase)
        phase: "notStartedPhase",                    // notStartedPhase | startPhase | playPhase | roundOverPhase
        seed: seed
    };
};
