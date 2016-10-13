function followTrajectory(trajectory, time) {
    var percentage = time / trajectory.duration;
    percentage = Math.max(0, Math.min(1, percentage));
    var x = trajectory.startX + percentage*(trajectory.endX - trajectory.startX);
    var y = trajectory.startY + percentage*(trajectory.endY - trajectory.startY);
    var direction = trajectory.startDirection + percentage*(trajectory.endDirection - trajectory.startDirection);
    if (trajectory.type === "arc") {
        var arcAngle = trajectory.arcStartAngle + percentage*(trajectory.arcEndAngle - trajectory.arcStartAngle);
        x = trajectory.arcCenterX + trajectory.arcRadius*Math.cos(arcAngle);
        y = trajectory.arcCenterY + trajectory.arcRadius*Math.sin(arcAngle);
    }
    return { x, y, direction };
}

function createTrajectory({ startX, startY, startDirection, speed, turningVelocity, duration }) {
    var trajectory = {
        duration,
        startX,
        startY,
        startDirection,
        speed,
        turningVelocity
    };

    var xDiff = 0;
    var yDiff = 0;
    if (speed === 0) {
        // 0 diameter arc
        trajectory.type = "still_arc";
        xDiff = 0;
        yDiff = 0;
    } else if (turningVelocity === 0) {
        // Straight line
        trajectory.type = "straight";
        xDiff = duration * speed * Math.cos(startDirection);
        yDiff = duration * speed * Math.sin(startDirection);
    } else {
        // Circle arc
        trajectory.type = "arc";
        var radius = speed / turningVelocity;
        var angle = duration * turningVelocity;

        trajectory.arcCenterX = trajectory.startX - radius * Math.cos(startDirection - Math.PI / 2);
        trajectory.arcCenterY = trajectory.startY - radius * Math.sin(startDirection - Math.PI / 2);
        trajectory.arcRadius = Math.abs(radius);
        trajectory.arcStartAngle = startDirection - radius / Math.abs(radius) * Math.PI / 2;
        trajectory.arcAngleDiff = angle;
        trajectory.arcEndAngle = trajectory.arcStartAngle + trajectory.arcAngleDiff;

        xDiff = -radius * (Math.cos(startDirection - Math.PI / 2) + Math.cos(startDirection + Math.PI / 2 + angle));
        yDiff = -radius * (Math.sin(startDirection - Math.PI / 2) + Math.sin(startDirection + Math.PI / 2 + angle));
    }
    trajectory.endX = trajectory.startX + xDiff;
    trajectory.endY = trajectory.startY + yDiff;
    trajectory.endDirection = trajectory.startDirection + turningVelocity * duration;
    return trajectory;
}

export {
    createTrajectory,
    followTrajectory
};
