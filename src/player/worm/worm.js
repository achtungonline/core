module.exports = function Worm(id, head, direction, speed) {
    return {
        id: id,
        head: head,
        direction: direction,
        speed: speed,
        body: [head]
    };
}