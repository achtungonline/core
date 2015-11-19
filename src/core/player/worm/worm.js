module.exports = function Worm(args) {
    return {
        id: args.id,
        playerId: args.playerId,
        head: args.head,
        direction: args.direction,
        speed: args.speed,
        defaultSpeed: args.speed,
        turningSpeed: args.turningSpeed,
        defaultTurningSpeed: args.turningSpeed,
        alive: args.alive,
        jump: {
            remainingJumpTime: 0,
            timeSinceLastJump: 0
        },
        immunityData: undefined
    };
};