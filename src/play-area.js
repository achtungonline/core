var PlayArea = module.exports = {};

PlayArea.FREE = -1;
PlayArea.OBSTACLE = -2;

PlayArea.createPlayArea = function createPlayArea(width, height) {
    var playArea = new Array(width*height);
    for (var i = 0; i < playArea.length; i++) {
        playArea[i] = PlayArea.FREE;
    }
    return playArea;
};