module.exports = function Worm(id, head, direction, speed, turningSpeed, alive) {
    return {
        id: id,
        head: head,
        direction: direction,
        speed: speed,
        defaultSpeed: speed,
        turningSpeed: turningSpeed,
        defaultTurningSpeed: turningSpeed,
        alive: alive
    };
};