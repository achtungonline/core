module.exports = function Worm(id, head, direction, speed, turningSpeed, alive) {
    return {
        id: id,
        head: head,
        direction: direction,
        speed: speed,
        turningSpeed: turningSpeed,
        alive: alive,
        body: []
    };
};