var trajectoryUtil = require("../geometry/trajectory/trajectory-util.js");

// TODO Should replace this with some binary format, probably protobuf
function compressWormSegment(segment) {
    if (segment.type === "clear") {
        return [
            segment.type,
            segment.startTime.toFixed(3),
            segment.endTime.toFixed(3),
            segment.index
        ];
    } else {
        return [
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
}

function decompressWormSegment(data) {
    if (data.length === 4) {
        return {
            type: data[0],
            startTime: parseFloat(data[1]),
            endTime: parseFloat(data[2]),
            index: data[3]
        }
    }
    var duration = parseFloat(data[0]);
    var index = data[1];
    var jump = data[2];
    var playerId = data[3];
    var size = data[4];
    var speed = data[5];
    var startDirection = parseFloat(data[6]);
    var startTime = parseFloat(data[7]);
    var startX = parseFloat(data[8]);
    var startY = parseFloat(data[9]);
    var turningVelocity = data[10];
    var trajectory = trajectoryUtil.createTrajectory({startX, startY, startDirection, speed, turningVelocity, duration});
    trajectory.index = index;
    trajectory.jump = jump;
    trajectory.playerId = playerId;
    trajectory.size = size;
    trajectory.startTime = startTime;
    trajectory.endTime = startTime + duration;
    return trajectory;
}

module.exports = {
    compressWormSegment,
    decompressWormSegment
};