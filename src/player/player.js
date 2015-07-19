module.exports = function Player(id, worms) {
    if (!worms) {
        worms = [];
    } else if (!worms.length) {
        worms = [worms];
    }

    return {
        id: id,
        worms: worms
    };
}