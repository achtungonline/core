module.exports = function GameState(players, worms, map, playArea, playAreaHandler) {

    return {
        players: players,
        worms: worms,
        map: map,
        playArea: playArea,
        playAreaHandler: playAreaHandler // TODO Should not be here later
    };
};