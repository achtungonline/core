module.exports = function Worm(id, head, direction, speed, turningSpeed) {
    return {
        id: id,
        head: head,
        direction: direction,
        speed: speed,
        turningSpeed: turningSpeed,
        body: [head]
    };
}