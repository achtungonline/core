module.exports = function GameState(players, worms, map, playArea, playAreaUpdateBuffer) {

    return {
        players: players,
        worms: worms,
        map: map,
        playArea: playArea,
        playAreaUpdateBuffer: playAreaUpdateBuffer,
        gameActive: false,
        gamePaused: false,
        phaseTimer: 0,
        wormBodyImmunityHandler:
        {
            wormData: {},
            cellDistance: {}
        }
    };
};