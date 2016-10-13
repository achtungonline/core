import * as trajectoryUtil from "../geometry/trajectory/trajectory-util.js";

// TODO Should replace this with some binary format, probably protobuf
function compressWormSegment(segment) {
    return [
        segment.type,
        segment.duration.toFixed(3),
        segment.index,
        segment.jump,
        segment.playerId,
        segment.size,
        segment.speed,
        segment.startDirection.toFixed(3),
        segment.startTime.toFixed(3),
        segment.startX.toFixed(3),
        segment.startY.toFixed(3),
        segment.turningVelocity
    ];
}

function decompressWormSegment(data) {
    var [type, duration, index, jump, playerId, size, speed, startDirection, startTime, startX, startY, turningVelocity] = data;
    duration = parseFloat(duration);
    startDirection = parseFloat(startDirection);
    startTime = parseFloat(startTime);
    startX = parseFloat(startX);
    startY = parseFloat(startY);
    var trajectory = trajectoryUtil.createTrajectory({startX, startY, startDirection, speed, turningVelocity, duration});
    trajectory.type = type;
    trajectory.index = index;
    trajectory.jump = jump;
    trajectory.playerId = playerId;
    trajectory.size = size;
    trajectory.startTime = startTime;
    trajectory.endTime = startTime + duration;
    return trajectory;
}

export {
    compressWormSegment,
    decompressWormSegment
};