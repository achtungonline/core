module.exports = function TrajectoryHandler() {

    function addCurve(trajectory, curve) {
        trajectory.push(curve);
    }

    function removeDeltaTime(trajectory, deltaTime) {
        while (trajectory.length > 0 && deltaTime >= trajectory[0].duration) {
            deltaTime -= trajectory[0].duration;
            trajectory.shift();
        }
        if (trajectory.length > 0) {
            trajectory[0].duration -= deltaTime;
        }
    }

    function followTrajectory(trajectory, x, y, direction, deltaTime, callBack) {
        var distance = 0;
        var time = 0;
        trajectory.some(function (move) {
            var moveEndTime = time + move.duration;
            while (time < moveEndTime) {
                var timeStep = Math.min(moveEndTime - time, deltaTime);
                var distanceTravelled = move.speed * timeStep;
                var angleTurned = move.turningSpeed * timeStep;
                var turnRadius;
                if (move.turningSpeed < 0) {
                    turnRadius = -move.speed / move.turningSpeed;
                    x += turnRadius * (Math.cos(direction - Math.PI/2) + Math.cos(direction + Math.PI/2 + angleTurned));
                    y += turnRadius * (Math.sin(direction - Math.PI/2) + Math.sin(direction + Math.PI/2 + angleTurned));
                } else if (move.turningSpeed > 0) {
                    turnRadius = move.speed / move.turningSpeed;
                    x += turnRadius * (Math.cos(direction + Math.PI/2) + Math.cos(direction - Math.PI/2 + angleTurned));
                    y += turnRadius * (Math.sin(direction + Math.PI/2) + Math.sin(direction - Math.PI/2 + angleTurned));
                } else {
                    x += distanceTravelled * Math.cos(direction);
                    y += distanceTravelled * Math.sin(direction);
                }
                direction += angleTurned;
                distance += distanceTravelled;
                time += timeStep;
                var stop = callBack(x, y, direction, time, distance);
                if (stop) {
                    return true;
                }
            }
        });
    }

    return  {
        addCurve: addCurve,
        removeDeltaTime: removeDeltaTime,
        followTrajectory: followTrajectory
    };
};
