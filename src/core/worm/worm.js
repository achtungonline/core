module.exports = function Worm(args) {
    return {
        id: args.id,
        playerId: args.playerId,
        head: args.head,
        size: args.size,
        direction: args.direction,
        speed: args.speed,
        turningSpeed: args.turningSpeed,
        alive: args.alive,
        pathSegments: [],
        jump: {
            remainingJumpTime: 0,
            timeSinceLastJump: 0
        },
        immunityData: undefined
    };
};
